import { loadPyodide } from "pyodide";

// Define the interface for messages
type WorkerMessage = 
  | { type: 'INIT' }
  | { type: 'RUN_PYTHON', code: string }
  | { type: 'LOAD_DATA', buffer: Uint8Array, tableName: string };

let pyodide: any = null;

// Initialize Pyodide
async function initPyodide() {
  try {
    self.postMessage({ type: 'STATUS', message: 'Loading Pyodide...' });
    
    pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.0/full/"
    });

    self.postMessage({ type: 'STATUS', message: 'Loading Python packages...' });
    
    // Load necessary packages
    await pyodide.loadPackage(["pandas", "fastparquet", "matplotlib"]);
    
    // Define helper function to read parquet
    // We'll assume data is written to /data/{tableName}.parquet
    await pyodide.runPythonAsync(`
      import pandas as pd
      import os
      
      def get_dataframe(table_name="output"):
          path = f"/{table_name}.parquet"
          if os.path.exists(path):
              return pd.read_parquet(path, engine='fastparquet')
          else:
              return pd.DataFrame()
              
      print("Python environment ready. Use get_dataframe() to access SQL results.")
    `);

    self.postMessage({ type: 'READY' });
  } catch (err: any) {
    self.postMessage({ type: 'ERROR', message: err.message });
  }
}

// Handle messages
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type } = event.data;

  if (type === 'INIT') {
    await initPyodide();
  } else if (type === 'LOAD_DATA') {
    if (!pyodide) return;
    try {
      const { buffer, tableName } = event.data as any;
      pyodide.FS.writeFile(`/${tableName}.parquet`, buffer);
      self.postMessage({ type: 'DATA_LOADED', tableName });
    } catch (err: any) {
      self.postMessage({ type: 'ERROR', message: `Failed to load data: ${err.message}` });
    }
  } else if (type === 'RUN_PYTHON') {
    if (!pyodide) return;
    try {
      const { code } = event.data as any;
      
      // Redirect stdout
      pyodide.setStdout({ batched: (msg: string) => self.postMessage({ type: 'STDOUT', message: msg }) });
      pyodide.setStderr({ batched: (msg: string) => self.postMessage({ type: 'STDERR', message: msg }) });

      await pyodide.runPythonAsync(code);
      
      self.postMessage({ type: 'EXECUTION_COMPLETE' });
    } catch (err: any) {
      self.postMessage({ type: 'ERROR', message: err.message });
    }
  }
};
