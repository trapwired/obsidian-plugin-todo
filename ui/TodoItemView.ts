import {DateTime} from 'luxon';
import {ItemView, MarkdownRenderer, WorkspaceLeaf} from 'obsidian';
import {VIEW_TYPE_TODO} from '../constants';
import {TodoItem, TodoItemStatus} from '../model/TodoItem';
import {Icon, RenderIcon} from './icons';

enum TodoItemViewPane {
  Today,
  Upcoming,
  WithoutDate,
  Waiting
}

export enum ActiveWorkspace {
  Personal,
  Work,
  CaDo,
}
export interface TodoItemViewProps {
  todos: TodoItem[];
  formatDate: (date: DateTime) => string;
  openFile: (filePath: string) => void;
  toggleTodo: (todo: TodoItem, newStatus: TodoItemStatus) => void;
}

interface TodoItemViewState {
  activePane: TodoItemViewPane;
  activeWorkspace: ActiveWorkspace
}

export class TodoItemView extends ItemView {
  private props: TodoItemViewProps;
  private state: TodoItemViewState;

  constructor(leaf: WorkspaceLeaf, props: TodoItemViewProps) {
    super(leaf);
    this.props = props;
    this.state = {
      activePane: TodoItemViewPane.Today,
      activeWorkspace: ActiveWorkspace.Work
    };
  }

  getViewType(): string {
    return VIEW_TYPE_TODO;
  }

  getDisplayText(): string {
    return 'Todo';
  }

  getIcon(): string {
    return 'checkmark';
  }

  onClose(): Promise<void> {
    return Promise.resolve();
  }

  public setProps(setter: (currentProps: TodoItemViewProps) => TodoItemViewProps): void {
    this.props = setter(this.props);
    this.render();
  }

  private setViewState(newState: TodoItemViewState) {
    this.state = newState;
    this.render();
  }

  private render(): void {
    const container = this.containerEl.children[1];
    container.empty();
    container.createDiv('todo-item-view-container', (el) => {
      el.createDiv('todo-item-view-switch-button', (el) => {
        this.renderWorkspaceSwitchButton(el);
      });
      el.createDiv('todo-item-view-toolbar', (el) => {
        this.renderToolBar(el);
      });
      el.createDiv('todo-item-view-items', (el) => {
        this.renderItems(el);
      });
    });
  }

  private renderWorkspaceSwitchButton(container: HTMLDivElement) {
    const getNextWorkspace = (current: ActiveWorkspace) => {
      let values = Object.keys(ActiveWorkspace)
      return (current + 1) % (values.length / 2)
    }
    const switchWorkspace = () => {
      const newState = {
        ...this.state,
        activeWorkspace: getNextWorkspace(this.state.activeWorkspace)
      };
      this.setViewState(newState);
    };

    container.createDiv(`todo-item-view-switch-button-item`, (el) => {
      el.appendChild(new Text(ActiveWorkspace[this.state.activeWorkspace]));
      el.onClickEvent(() => switchWorkspace());
    });
  }


  private renderToolBar(container: HTMLDivElement) {
    const activeClass = (pane: TodoItemViewPane) => {
      return pane === this.state.activePane ? ' active' : '';
    };

    const setActivePane = (pane: TodoItemViewPane) => {
      const newState = {
        ...this.state,
        activePane: pane,
      };
      this.setViewState(newState);
    };

    container.createDiv(`todo-item-view-toolbar-item${activeClass(TodoItemViewPane.Today)}`, (el) => {
      el.appendChild(RenderIcon(Icon.Today, 'Today'));
      el.onClickEvent(() => setActivePane(TodoItemViewPane.Today));
    });
    container.createDiv(`todo-item-view-toolbar-item${activeClass(TodoItemViewPane.WithoutDate)}`, (el) => {
      el.appendChild(RenderIcon(Icon.WithoutDate, 'Without Date'));
      el.onClickEvent(() => setActivePane(TodoItemViewPane.WithoutDate));
    });
    container.createDiv(`todo-item-view-toolbar-item${activeClass(TodoItemViewPane.Upcoming)}`, (el) => {
      el.appendChild(RenderIcon(Icon.Upcoming, 'Upcoming'));
      el.onClickEvent(() => setActivePane(TodoItemViewPane.Upcoming));
    });
    container.createDiv(`todo-item-view-toolbar-item${activeClass(TodoItemViewPane.Waiting)}`, (el) => {
      el.appendChild(RenderIcon(Icon.Waiting, 'Waiting'));
      el.onClickEvent(() => setActivePane(TodoItemViewPane.Waiting));
    });
  }

  private renderItems(container: HTMLDivElement) {
    this.props.todos
      .filter(this.filterForState, this)
        .filter(this.filterForWorkspace, this)
      .sort(this.sortByActionDate)
      .forEach((todo) => {
        container.createDiv('todo-item-view-item', (el) => {
          el.createDiv('todo-item-view-item-checkbox', (el) => {
            el.createEl('input', { type: 'checkbox' }, (el) => {
              el.checked = todo.status === TodoItemStatus.Done;
              el.onClickEvent(() => {
                this.toggleTodo(todo);
              });
            });
          });
          el.createDiv('todo-item-view-item-description', (el) => {
            MarkdownRenderer.renderMarkdown(todo.description, el, todo.sourceFilePath, this);
            if (todo.actionDate) {
              el.createSpan('due-date', (el) => {
                if (todo.actionDate.startOf('day') < DateTime.now().startOf('day')) {
                  el.classList.add('overdue');
                } else if (todo.actionDate.startOf('day') > DateTime.now().startOf('day')) {
                  el.classList.add('future-due');
                }
                el.setText(this.props.formatDate(todo.actionDate));
              });
            }
          });
          el.createDiv('todo-item-view-item-link', (el) => {
            el.appendChild(RenderIcon(Icon.Reveal, 'Open file'));
            el.onClickEvent(() => {
              this.openFile(todo);
            });
          });
        });
      });
  }

  private filterForWorkspace(value: TodoItem, _index: number, _array: TodoItem[]): boolean {
    return value.workspace == this.state.activeWorkspace
  }

  private filterForState(value: TodoItem, _index: number, _array: TodoItem[]): boolean {
    const isToday = (date: DateTime) => {
      const today = DateTime.now();
      return date.day == today.day && date.month == today.month && date.year == today.year;
    };

    const isBeforeToday = (date: DateTime) => {
      const today = DateTime.now();
      return date < today;
    };

    const isTodayNote = value.actionDate && (isToday(value.actionDate) || isBeforeToday(value.actionDate));
    const isScheduledNote = !value.isWaitingNote && value.actionDate && !isTodayNote;

    switch (this.state.activePane) {
      case TodoItemViewPane.WithoutDate:
        return !value.isWaitingNote && !isTodayNote && !isScheduledNote;
      case TodoItemViewPane.Upcoming:
        return isScheduledNote;
      case TodoItemViewPane.Waiting:
        return value.isWaitingNote;
      case TodoItemViewPane.Today:
        return isTodayNote;
    }
  }

  private sortByActionDate(a: TodoItem, b: TodoItem): number {
    if (!a.actionDate && !b.actionDate) {
      if (a.isWaitingNote && !b.isWaitingNote) {
        return -1;
      }
      if (!a.isWaitingNote && b.isWaitingNote) {
        return 1;
      }
      return 0;
    }
    return a.actionDate < b.actionDate ? -1 : a.actionDate > b.actionDate ? 1 : 0;
  }

  private toggleTodo(todo: TodoItem): void {
    this.props.toggleTodo(todo, TodoItemStatus.toggleStatus(todo.status));
  }

  private openFile(todo: TodoItem): void {
    this.props.openFile(todo.sourceFilePath);
  }
}
