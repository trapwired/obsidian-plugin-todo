import {DateParser} from '../util/DateParser';
import {TodoItem, TodoItemStatus} from './TodoItem';
import luxon, {DateTime} from 'luxon';
import {extractDueDateFromDailyNotesFile} from '../util/DailyNoteParser';
import {ActiveWorkspace} from "../ui/TodoItemView";

export class TodoParser {
  private dateParser: DateParser;

  constructor(dateParser: DateParser) {
    this.dateParser = dateParser;
  }

  async parseTasks(filePath: string, fileContents: string): Promise<TodoItem[]> {
    const pattern = /([-*]) \[(\s|x)?]\s(.*)/g;
    return [...fileContents.matchAll(pattern)].map((task) => this.parseTask(filePath, task));
  }

  private getWorkspace(filePath: string, description: string): ActiveWorkspace{
    if (description.match(/#(dg)/g) != null){
      return ActiveWorkspace.Work
    }
    if (description.match(/#(cado)/g) != null){
      return ActiveWorkspace.CaDo
    }
    if (description.match(/#(me)/g) != null){
      return ActiveWorkspace.Personal
    }

    function containsAny(source: string, targets: string[]): boolean {
      return targets.some(target => source.includes(target));
    }

    const cadoFolders = ['CaDo']
    if (containsAny(filePath, cadoFolders)){
      return ActiveWorkspace.CaDo
    }

    const personalFolders = ['Anything Goes', 'Mine', 'Projekte', 'Software Design']
    if (containsAny(filePath, personalFolders)){
      return ActiveWorkspace.Personal
    }

    return ActiveWorkspace.Work
  }

  private parseTask(filePath: string, entry: RegExpMatchArray): TodoItem {
    const todoItemOffset = 2; // Strip off `-|* `
    const status = entry[2] === 'x' ? TodoItemStatus.Done : TodoItemStatus.Todo;
    const description = entry[3];

    let actionDate = this.parseDueDate(description, filePath);
    const descriptionWithoutDate = this.dateParser.removeDate(description);
    const waitingPattern = /#(wait)/g;
    const isWaitingTask = description.match(waitingPattern) != null;

    const todayPattern = /#(today)/g;
    const isToday = description.match(todayPattern) != null;
    if (isToday){
      actionDate = luxon.DateTime.now()
    }

    const workspace = this.getWorkspace(filePath, description)

    return new TodoItem(
      status,
      descriptionWithoutDate,
      isWaitingTask,
      filePath,
      (entry.index ?? 0) + todoItemOffset,
      entry[0].length - todoItemOffset,
      workspace,
      !isWaitingTask ? actionDate : undefined,
    );
  }

  private parseDueDate(description: string, filePath: string): DateTime | undefined {
    const taggedDueDate = this.dateParser.parseDate(description);
    if (taggedDueDate) {
      return taggedDueDate;
    }
    return extractDueDateFromDailyNotesFile(filePath);
  }
}
