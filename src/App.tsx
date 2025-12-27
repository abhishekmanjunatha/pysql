import { useEffect, useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import { initDuckDB, runQuery, resetTable, importCSV, getDatabaseSchema, runQueryToParquet } from './lib/duckdb';
import { challenges } from './lib/challenges';
import { EMPLOYEE_DATASET_SQL } from './lib/playground-data.ts';
import { Play, Loader2, CheckCircle, XCircle, ChevronRight, ChevronLeft, Terminal, BookOpen, Database, Sun, Moon, ChevronDown, Upload, Code2, Lightbulb, Key, X } from 'lucide-react';
import clsx from 'clsx';
import PyodideWorker from './workers/pyodide.worker.ts?worker';

// Simple Modal Component
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [isReady, setIsReady] = useState(false);
  const [isPythonReady, setIsPythonReady] = useState(false);
  const [activeTab, setActiveTab] = useState<'challenges' | 'playground'>('challenges');
  const [activeChallengeIndex, setActiveChallengeIndex] = useState(0);
  const [sidebarView, setSidebarView] = useState<'list' | 'details'>('list');
  const [language, setLanguage] = useState<'sql' | 'python'>('sql');
  
  const [showHint, setShowHint] = useState(false);

  const [code, setCode] = useState("");
  const [pythonCode, setPythonCode] = useState(`import pandas as pd

# Get the result of your last SQL query
df = get_dataframe("output")

# Perform your analysis
print(df.head())
print(df.describe())
`);
  const [playgroundCode, setPlaygroundCode] = useState("SELECT * FROM employees LIMIT 10;");
  
  const [result, setResult] = useState<any>(null);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'success' | 'failure'>('idle');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [expandedTables, setExpandedTables] = useState<string[]>([]);
  const [schema, setSchema] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<Worker | null>(null);

  const activeChallenge = challenges[activeChallengeIndex];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    initDuckDB().then(() => setIsReady(true));
    
    // Init Python Worker
    workerRef.current = new PyodideWorker();
    workerRef.current.onmessage = (event) => {
      const { type, message, tableName } = event.data;
      if (type === 'READY') {
        setIsPythonReady(true);
        setConsoleOutput(prev => [...prev, "Python environment ready."]);
      } else if (type === 'STATUS') {
        setConsoleOutput(prev => [...prev, `[System] ${message}`]);
      } else if (type === 'STDOUT') {
        setConsoleOutput(prev => [...prev, message]);
      } else if (type === 'STDERR') {
        setConsoleOutput(prev => [...prev, `Error: ${message}`]);
      } else if (type === 'ERROR') {
        setError(message);
        setConsoleOutput(prev => [...prev, `Error: ${message}`]);
      } else if (type === 'DATA_LOADED') {
        setConsoleOutput(prev => [...prev, `[System] Data loaded into Python as '${tableName}'`]);
      } else if (type === 'EXECUTION_COMPLETE') {
        // Execution finished
      }
    };
    workerRef.current.postMessage({ type: 'INIT' });

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Toggle Table Expansion
  const toggleTable = (tableName: string) => {
    setExpandedTables(prev => 
      prev.includes(tableName) 
        ? prev.filter(t => t !== tableName) 
        : [...prev, tableName]
    );
  };

  const refreshSchema = async () => {
    try {
      const s = await getDatabaseSchema();
      setSchema(s);
    } catch (err) {
      console.error("Failed to fetch schema", err);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const tableName = file.name.split('.')[0].replace(/[^a-zA-Z0-9_]/g, '_');
    
    try {
      await importCSV(file, tableName);
      await refreshSchema();
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setError(`Failed to import CSV: ${err.message}`);
    }
  };

  // Handle Tab Switching and Data Loading
  useEffect(() => {
    if (!isReady) return;

    const loadData = async () => {
      setResult(null);
      setError(null);
      setValidationStatus('idle');

      if (activeTab === 'challenges') {
        // Load Challenge
        setCode(challenges[activeChallengeIndex].initialCode);
        try {
          await resetTable(challenges[activeChallengeIndex].setupSql);
        } catch (err) {
          console.error("Failed to setup challenge", err);
        }
      } else {
        // Load Playground
        setCode(playgroundCode);
        try {
          await resetTable(EMPLOYEE_DATASET_SQL);
        } catch (err) {
          console.error("Failed to setup playground", err);
        }
      }
      await refreshSchema();
    };

    loadData();
  }, [isReady, activeTab, activeChallengeIndex]);

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || "";
    if (language === 'sql') {
      setCode(newCode);
      if (activeTab === 'playground') {
        setPlaygroundCode(newCode);
      }
    } else {
      setPythonCode(newCode);
    }
  };

  const handleRun = async () => {
    setError(null);
    setValidationStatus('idle');
    
    if (language === 'sql') {
      try {
        // Run SQL for display
        const res = await runQuery(code);
        const rows = res.toArray().map((row: any) => row.toJSON());
        setResult(rows);
        await refreshSchema();

        // Export to Parquet and send to Python
        if (isPythonReady && workerRef.current) {
          try {
            const parquetBuffer = await runQueryToParquet(code);
            workerRef.current.postMessage({ 
              type: 'LOAD_DATA', 
              buffer: parquetBuffer, 
              tableName: 'output' 
            }, [parquetBuffer.buffer]);
          } catch (err) {
            console.warn("Failed to export to parquet for python", err);
          }
        }

      } catch (err: any) {
        setError(err.message);
      }
    } else {
      // Run Python
      if (!isPythonReady || !workerRef.current) return;
      setConsoleOutput([]); // Clear previous output
      workerRef.current.postMessage({ type: 'RUN_PYTHON', code: pythonCode });
    }
  };

  const handleRunRef = useRef(handleRun);
  handleRunRef.current = handleRun;

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunRef.current();
    });
  };

  const handleSubmit = async () => {
    if (activeTab === 'playground') return;
    
    await handleRun();
    try {
      // Run expected query
      const expectedRes = await runQuery(activeChallenge.expectedSql);
      const expectedRows = expectedRes.toArray().map((row: any) => row.toJSON());
      
      // Run user query again to get fresh result for comparison
      const userRes = await runQuery(code);
      const userRows = userRes.toArray().map((row: any) => row.toJSON());

      const isMatch = JSON.stringify(userRows) === JSON.stringify(expectedRows);
      
      setValidationStatus(isMatch ? 'success' : 'failure');
    } catch (err: any) {
      setValidationStatus('failure');
      setError(err.message);
    }
  };

  if (!isReady) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-900 text-white">
        <Loader2 className="animate-spin mr-2" /> Initializing DuckDB-WASM...
      </div>
    );
  }

  return (
    <div className={clsx("h-screen w-screen flex flex-col transition-colors duration-200", theme === 'dark' ? 'dark bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800')}>
      <header className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 justify-between bg-white dark:bg-slate-900 transition-colors shrink-0">
        <div className="flex items-center gap-2 md:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500/10 rounded flex items-center justify-center text-emerald-500 shrink-0">
              <Database size={18} />
            </div>
            <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100 whitespace-nowrap">
              <span className="hidden md:inline">DataGym - PySQL Studio</span>
              <span className="md:hidden">DataGym</span>
            </h1>
          </div>
          
          {/* Tab Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800/50 rounded-lg p-1 gap-1 shrink-0">
            <button
              onClick={() => setActiveTab('challenges')}
              className={clsx(
                "px-2 md:px-3 py-1 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                activeTab === 'challenges' 
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              )}
            >
              <BookOpen size={14} /> <span className="hidden sm:inline">Challenges</span>
            </button>
            <button
              onClick={() => setActiveTab('playground')}
              className={clsx(
                "px-2 md:px-3 py-1 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                activeTab === 'playground' 
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              )}
            >
              <Terminal size={14} /> <span className="hidden sm:inline">Playground</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {activeTab === 'challenges' && (
            <>
              <button
                onClick={() => setShowHint(true)}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Show Hint"
              >
                <Lightbulb size={18} />
              </button>
              <button
                onClick={() => {
                  if (confirm("This will replace your current code with the solution. Are you sure?")) {
                    setCode(activeChallenge.solution);
                  }
                }}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Show Solution"
              >
                <Key size={18} />
              </button>
            </>
          )}

          <button 
            onClick={handleRun}
            disabled={language === 'python' && !isPythonReady}
            className={clsx(
              "px-3 md:px-4 py-1.5 rounded text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors flex items-center gap-2",
              language === 'python' && !isPythonReady && "opacity-50 cursor-not-allowed"
            )}
          >
            {language === 'python' && !isPythonReady ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />} 
            <span className="hidden sm:inline">Run</span>
          </button>
          
          {activeTab === 'challenges' && (
            <button 
              onClick={handleSubmit}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 md:px-4 py-1.5 rounded flex items-center gap-2 font-medium transition-colors shadow-lg shadow-emerald-900/20"
            >
              <CheckCircle size={16} /> <span className="hidden sm:inline">Submit</span>
            </button>
          )}
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        <PanelGroup 
          orientation={isMobile ? "vertical" : "horizontal"} 
          className="h-full w-full"
        >
          {/* Sidebar */}
          <Panel 
            defaultSize={isMobile ? "30" : "20"} 
            minSize="15" 
            maxSize={isMobile ? "50" : "40"} 
          >
            <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900/50 border-r border-b md:border-b-0 border-slate-200 dark:border-slate-800 transition-colors">
              {activeTab === 'challenges' ? (
                sidebarView === 'list' ? (
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
                      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Challenges</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                      {challenges.map((c, i) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setActiveChallengeIndex(i);
                            setSidebarView('details');
                          }}
                          className={clsx(
                            "w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center justify-between group",
                            i === activeChallengeIndex 
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent"
                          )}
                        >
                          <span className="truncate">{c.title}</span>
                          <ChevronRight size={14} className="shrink-0 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 shrink-0 flex items-center gap-2">
                      <button 
                        onClick={() => setSidebarView('list')}
                        className="p-1 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                        title="Back to Challenges"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Challenge Details</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{activeChallenge.title}</h2>
                      <div className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed whitespace-pre-wrap">
                        {activeChallenge.description}
                      </div>

                      {activeChallenge.concepts && activeChallenge.concepts.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {activeChallenge.concepts.map((concept, i) => (
                            <span key={i} className="px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-100 dark:border-blue-800/30">
                              {concept}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {activeChallenge.expectedOutput && (
                        <div className="mt-4">
                          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Expected Output</h3>
                          <div className="bg-slate-100 dark:bg-slate-900 rounded p-2 overflow-x-auto border border-slate-200 dark:border-slate-800">
                            <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre">{activeChallenge.expectedOutput}</pre>
                          </div>
                        </div>
                      )}
                      <div className="p-4 bg-white dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none mt-4">
                        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase mb-2">Task</h3>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{activeChallenge.task}</p>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex-1 overflow-y-auto p-4">
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Playground Mode</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                    Explore the employee dataset freely. Click on a table to view its schema.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-white dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none">
                      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase mb-2">Custom Data</h3>
                      <input 
                        type="file" 
                        accept=".csv" 
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden" 
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 py-2 rounded text-sm font-medium transition-colors"
                      >
                        <Upload size={14} /> Upload CSV
                      </button>
                      <p className="text-[10px] text-slate-400 mt-2 text-center">
                        Uploads are session-only.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Available Tables</h3>
                      <div className="space-y-2">
                        {schema.map((table) => (
                          <div key={table.tableName} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                            <button
                              onClick={() => toggleTable(table.tableName)}
                              className="w-full flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                            >
                              <div className="flex items-center gap-2">
                                <div className={clsx("w-2 h-2 rounded-full", {
                                  'bg-blue-400': table.color === 'blue',
                                  'bg-purple-400': table.color === 'purple',
                                  'bg-orange-400': table.color === 'orange',
                                  'bg-pink-400': table.color === 'pink',
                                  'bg-gray-400': table.color === 'gray',
                                })}></div>
                                <code className="text-sm font-medium text-slate-700 dark:text-slate-300">{table.tableName}</code>
                              </div>
                              <ChevronDown 
                                size={14} 
                                className={clsx("text-slate-400 transition-transform", expandedTables.includes(table.tableName) ? "rotate-180" : "")} 
                              />
                            </button>
                            
                            {expandedTables.includes(table.tableName) && (
                              <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-2">
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr>
                                      <th className="text-left text-slate-400 font-medium pb-1 pl-2">Column</th>
                                      <th className="text-right text-slate-400 font-medium pb-1 pr-2">Type</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {table.columns.map((col: any) => (
                                      <tr key={col.name} className="border-t border-slate-100 dark:border-slate-800/50">
                                        <td className="py-1 pl-2 text-slate-600 dark:text-slate-400 font-mono flex items-center gap-1">
                                          {col.name}
                                          {col.pk && <span className="text-[10px] bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 px-1 rounded">PK</span>}
                                          {col.fk && <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-500 px-1 rounded" title={`FK to ${col.fk}`}>FK</span>}
                                        </td>
                                        <td className="py-1 pr-2 text-right text-slate-500 dark:text-slate-500 font-mono">{col.type}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-white dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none">
                      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase mb-2">Tip</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Use <code className="text-emerald-600 dark:text-emerald-400">DESCRIBE table_name;</code> to see the schema of any table.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Panel>

          <PanelResizeHandle className={clsx(
            "bg-slate-200 dark:bg-slate-800 hover:bg-emerald-500 dark:hover:bg-emerald-500 transition-colors flex-none",
            isMobile ? "h-1 cursor-row-resize" : "w-1 cursor-col-resize"
          )} />

          {/* Editor & Results */}
          <Panel defaultSize={isMobile ? "70" : "80"}>
            <PanelGroup orientation="vertical" className="h-full w-full">
              <Panel defaultSize="60" minSize="20" collapsible>
                <div className="h-full relative bg-white dark:bg-[#1e1e1e] flex flex-col">
                  {/* Language Switcher */}
                  <div className="h-10 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-4 bg-slate-50 dark:bg-slate-900/50">
                    <button
                      onClick={() => setLanguage('sql')}
                      className={clsx(
                        "text-xs font-bold uppercase tracking-wider flex items-center gap-2 pb-2.5 pt-3 border-b-2 transition-colors",
                        language === 'sql' 
                          ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" 
                          : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      )}
                    >
                      <Database size={14} /> SQL
                    </button>
                    <button
                      onClick={() => setLanguage('python')}
                      className={clsx(
                        "text-xs font-bold uppercase tracking-wider flex items-center gap-2 pb-2.5 pt-3 border-b-2 transition-colors",
                        language === 'python' 
                          ? "border-blue-500 text-blue-600 dark:text-blue-400" 
                          : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      )}
                    >
                      <Code2 size={14} /> Python
                    </button>
                    
                    <div className="flex-1" />
                    
                    {!isPythonReady && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Loader2 size={10} className="animate-spin" /> Loading Python...
                      </span>
                    )}
                  </div>

                  <div className="flex-1 relative">
                    <Editor
                      height="100%"
                      defaultLanguage={language}
                      language={language}
                      theme={theme === 'dark' ? "vs-dark" : "light"}
                      value={language === 'sql' ? code : pythonCode}
                      onChange={handleCodeChange}
                      onMount={handleEditorDidMount}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        padding: { top: 24 },
                        fontFamily: "'JetBrains Mono', monospace",
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                      }}
                    />
                  </div>
                </div>
              </Panel>
              
              <PanelResizeHandle className="h-1 bg-slate-200 dark:bg-slate-800 hover:bg-emerald-500 dark:hover:bg-emerald-500 transition-colors cursor-row-resize flex-none" />
              
              <Panel defaultSize="40" minSize="10" collapsible>
                <div className="h-full bg-slate-50 dark:bg-slate-900 flex flex-col border-t border-slate-200 dark:border-slate-800 transition-colors">
                  <div className="h-10 bg-white dark:bg-slate-800/50 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0 transition-colors">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {language === 'sql' ? "Query Results" : "Console Output"}
                    </span>
                    {activeTab === 'challenges' && validationStatus === 'success' && (
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-medium bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <CheckCircle size={14} /> Correct Answer
                      </span>
                    )}
                    {activeTab === 'challenges' && validationStatus === 'failure' && (
                      <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 text-sm font-medium bg-red-100 dark:bg-red-500/10 px-2 py-0.5 rounded-full">
                        <XCircle size={14} /> Incorrect Answer
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 overflow-auto p-0">
                    {error && (
                      <div className="p-4">
                        <div className="text-red-600 dark:text-red-400 font-mono text-sm bg-red-50 dark:bg-red-900/20 p-4 rounded border border-red-200 dark:border-red-900/50">
                          Error: {error}
                        </div>
                      </div>
                    )}
                    
                    {language === 'sql' && result && (
                      <table className="w-full text-left border-collapse text-sm font-mono">
                        <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 z-10 shadow-sm">
                          <tr>
                            {Object.keys(result[0] || {}).map(key => (
                              <th key={key} className="border-b border-slate-200 dark:border-slate-700 p-3 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase bg-slate-100 dark:bg-slate-800">{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {result.map((row: any, i: number) => (
                            <tr key={i} className="hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-200 dark:border-slate-800/50 last:border-0">
                              {Object.values(row).map((val: any, j) => (
                                <td key={j} className="p-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                  {val === null ? <span className="text-slate-400 dark:text-slate-600 italic">NULL</span> : val?.toString()}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {language === 'python' && (
                      <div className="p-4 font-mono text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                        {consoleOutput.map((line, i) => (
                          <div key={i} className="mb-1">{line}</div>
                        ))}
                        {consoleOutput.length === 0 && !error && (
                          <div className="text-slate-400 dark:text-slate-600 italic">
                            Run Python code to see output...
                          </div>
                        )}
                      </div>
                    )}
                    
                    {language === 'sql' && !result && !error && (
                      <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-600 text-sm italic">
                        Run a query to see results...
                      </div>
                    )}
                  </div>
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
      
      {/* Footer */}
      <footer className="h-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between px-4 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div>
          DataGym v{__APP_VERSION__}
        </div>
        <div>
          Created by <span className="font-medium text-slate-700 dark:text-slate-300">Abhishek Manjunath</span>
        </div>
      </footer>

      <Modal
        isOpen={showHint}
        onClose={() => setShowHint(false)}
        title="Hint"
      >
        <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
          {activeChallenge.hint}
        </div>
      </Modal>
    </div>
  );
}

export default App;
