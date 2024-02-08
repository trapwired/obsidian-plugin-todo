import { DateTime } from 'luxon';
import {ActiveWorkspace} from "../ui/TodoItemView";

export enum TodoItemStatus {
  Todo,
  Done,
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TodoItemStatus {
  export function toggleStatus(status: TodoItemStatus): TodoItemStatus {
    switch (status) {
      case TodoItemStatus.Todo:
        return TodoItemStatus.Done;
      case TodoItemStatus.Done:
        return TodoItemStatus.Todo;
    }
  }
}

export class TodoItem {
  public sourceFilePath: string;
  public startIndex: number;
  public length: number;

  public status: TodoItemStatus;
  public description: string;
  public actionDate?: DateTime;
  public isWaitingNote: boolean;

  public workspace: ActiveWorkspace

  constructor(
    status: TodoItemStatus,
    description: string,
    isSomedayMaybeNote: boolean,
    sourceFilePath: string,
    startIndex: number,
    length: number,
    workspace: ActiveWorkspace,
    actionDate?: DateTime,
  ) {
    this.status = status;
    this.description = description;
    this.actionDate = actionDate;
    this.isWaitingNote = isSomedayMaybeNote;
    this.sourceFilePath = sourceFilePath;
    this.startIndex = startIndex;
    this.length = length;
    this.workspace = workspace;
  }
}
