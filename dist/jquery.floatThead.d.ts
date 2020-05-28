interface floatTheadOptions {
    position?: string;
    scrollContainer?: ($table: JQuery) => JQuery;
    responsiveContainer?: ($table: JQuery) => JQuery;
    ariaLabel: ($table: JQuery, $headerCell: JQuery, columnIndex: number) => string;
    headerCellSelector?: string;
    floatTableClass?: string;
    floatContainerClass?: string;
    top?: number;
    bottom?: number;
    zIndex?: number;
    debug?: boolean;
    getSizingRow?: ($table: JQuery, $cols: JQuery, $fthCells: JQuery) => JQuery;
    copyTableClass?: boolean;
    autoReflow?: boolean;
}

interface JQuery {
    floatThead(floatTheadOptions?: floatTheadOptions): JQuery;
    floatThead(action: string): JQuery;
    trigger(action: string): JQuery;
    on(events: string, handler: (event: Event, $floatContainer: JQuery) => void|boolean): JQuery;
    on(events: string, handler: (event: Event, isFloated: boolean, $floatContainer: JQuery) => void|boolean): JQuery;
}
