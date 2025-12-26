import { useEffect, useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import { initDuckDB, runQuery, resetTable, importCSV, getDatabaseSchema } from './lib/duckdb';
import { challenges } from './lib/challenges';
import { EMPLOYEE_DATASET_SQL } from './lib/playground-data.ts';
import { Play, Loader2, CheckCircle, XCircle, ChevronRight, Terminal, BookOpen, Database, Sun, Moon, ChevronDown, Upload } from 'lucide-react';
import clsx from 'clsx';

function App() {
  const [isReady, setIsReady] = useState(false);
  const [activeTab, setActiveTab] = useState<'challenges' | 'playground'>('challenges');
  const [activeChallengeIndex, setActiveChallengeIndex] = useState(0);
  const [code, setCode] = useState("");
  const [playgroundCode, setPlaygroundCode] = useState("SELECT * FROM employees LIMIT 10;");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'success' | 'failure'>('idle');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [expandedTables, setExpandedTables] = useState<string[]>([]);
  const [schema, setSchema] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeChallenge = challenges[activeChallengeIndex];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    initDuckDB().then(() => setIsReady(true));
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
    setCode(newCode);
    if (activeTab === 'playground') {
      setPlaygroundCode(newCode);
    }
  };

  const handleRun = async () => {
    setError(null);
    setValidationStatus('idle');
    try {
      const res = await runQuery(code);
      const rows = res.toArray().map((row: any) => row.toJSON());
      setResult(rows);
      await refreshSchema();
    } catch (err: any) {
      setError(err.message);
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
              <span className="hidden md:inline">SQLista - SQL Pipeline Plumber</span>
              <span className="md:hidden">SQLista</span>
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

          <button 
            onClick={handleRun}
            className="px-3 md:px-4 py-1.5 rounded text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors flex items-center gap-2"
          >
            <Play size={16} /> <span className="hidden sm:inline">Run</span>
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
        <PanelGroup orientation={isMobile ? "vertical" : "horizontal"} className="h-full w-full">
          {/* Sidebar */}
          <Panel defaultSize={isMobile ? 30 : 20} minSize={15} maxSize={isMobile ? 50 : 40} collapsible>
            <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900/50 border-r border-b md:border-b-0 border-slate-200 dark:border-slate-800 transition-colors">
              {activeTab === 'challenges' ? (
                <>
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Challenges</h2>
                    <div className="space-y-1">
                      {challenges.map((c, i) => (
                        <button
                          key={c.id}
                          onClick={() => setActiveChallengeIndex(i)}
                          className={clsx(
                            "w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center justify-between group",
                            i === activeChallengeIndex 
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent"
                          )}
                        >
                          <span>{i + 1}. {c.title}</span>
                          {i === activeChallengeIndex && <ChevronRight size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{activeChallenge.title}</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                      {activeChallenge.description}
                    </p>
                    <div className="p-4 bg-white dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none">
                      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase mb-2">Task</h3>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{activeChallenge.task}</p>
                    </div>
                  </div>
                </>
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
          <Panel>
            <PanelGroup orientation="vertical" className="h-full w-full">
              <Panel defaultSize="60" minSize="20" collapsible>
                <div className="h-full relative bg-white dark:bg-[#1e1e1e]">
                  <Editor
                    height="100%"
                    defaultLanguage="sql"
                    theme={theme === 'dark' ? "vs-dark" : "light"}
                    value={code}
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
              </Panel>
              
              <PanelResizeHandle className="h-1 bg-slate-200 dark:bg-slate-800 hover:bg-emerald-500 dark:hover:bg-emerald-500 transition-colors cursor-row-resize flex-none" />
              
              <Panel defaultSize="40" minSize="10" collapsible>
                <div className="h-full bg-slate-50 dark:bg-slate-900 flex flex-col border-t border-slate-200 dark:border-slate-800 transition-colors">
                  <div className="h-10 bg-white dark:bg-slate-800/50 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0 transition-colors">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Query Results</span>
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
                    
                    {result && (
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
                    
                    {!result && !error && (
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
          SQLista v1.0.0
        </div>
        <div>
          Created by <span className="font-medium text-slate-700 dark:text-slate-300">Abhishek Manjunath</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
