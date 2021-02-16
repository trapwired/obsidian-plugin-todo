import { TAbstractFile, TFile, Vault } from 'obsidian';
import { TodoItem, TodoItemStatus } from '../model/TodoItem';
import { TodoParser } from '../model/TodoParser';

export class TodoIndex {
  private vault: Vault;
  private todos: Map<string, TodoItem[]>;
  private listeners: ((todos: TodoItem[]) => void)[];

  constructor(vault: Vault, listener: (todos: TodoItem[]) => void) {
    this.vault = vault;
    this.todos = new Map<string, TodoItem[]>();
    this.listeners = [listener];
  }

  async initialize(): Promise<void> {
    // TODO: persist index & last sync timestamp; only parse files that changed since then.
    const todoMap = new Map<string, TodoItem[]>();
    let numberOfTodos = 0;
    const timeStart = new Date().getTime();

    for (const file of this.vault.getMarkdownFiles()) {
      const todos = await this.parseTodosInFile(file);
      numberOfTodos += todos.length;
      if (todos.length > 0) {
        todoMap.set(file.path, todos);
      }
    }

    const totalTimeMs = new Date().getTime() - timeStart;
    console.log(
      `[obsidian-plugin-todo] Parsed ${numberOfTodos} TODOs from ${this.todos.size} markdown files in (${
        totalTimeMs / 1000.0
      }s)`,
    );
    this.todos = todoMap;
    this.registerEventHandlers();
    this.invokeListeners();
  }

  setStatus(todo: TodoItem, newStatus: TodoItemStatus): void {
    const file = this.vault.getAbstractFileByPath(todo.sourceFilePath) as TFile;
    const fileContents = this.vault.cachedRead(file);
    fileContents.then((c: string) => {
      const newTodo = `[${newStatus === TodoItemStatus.Done ? 'x' : ' '}] ${todo.description}`;
      const newContents = c.substring(0, todo.startIndex) + newTodo + c.substring(todo.startIndex + todo.length);
      this.vault.modify(file, newContents);
    });
  }

  private indexAbstractFile(file: TAbstractFile) {
    this.indexFile(file as TFile);
  }

  private indexFile(file: TFile) {
    console.log(`[obsidian-plugin-todo] Indexing ${file.path}`);
    this.parseTodosInFile(file).then((todos) => {
      this.todos.set(file.path, todos);
      this.invokeListeners();
    });
  }

  private clearIndex(path: string, silent = false) {
    this.todos.delete(path);
    if (!silent) {
      this.invokeListeners();
    }
  }

  private async parseTodosInFile(file: TFile): Promise<TodoItem[]> {
    const todoParser = new TodoParser();
    const fileContents = await this.vault.cachedRead(file);
    return todoParser.parseTasks(file.path, fileContents);
  }

  private registerEventHandlers() {
    this.vault.on('create', (file: TAbstractFile) => {
      this.indexAbstractFile(file);
    });
    this.vault.on('modify', (file: TAbstractFile) => {
      this.indexAbstractFile(file);
    });
    this.vault.on('delete', (file: TAbstractFile) => {
      this.clearIndex(file.path);
    });
    // We could simply change the references to the old path, but parsing again does the trick as well
    this.vault.on('rename', (file: TAbstractFile, oldPath: string) => {
      this.clearIndex(oldPath);
      this.indexAbstractFile(file);
    });
  }

  private invokeListeners() {
    // TODO: Does it make sense to index completed TODOs at all?
    const todos = ([] as TodoItem[])
      .concat(...Array.from(this.todos.values()))
      .filter((todo) => todo.status === TodoItemStatus.Todo);
    this.listeners.forEach((listener) => listener(todos));
  }
}