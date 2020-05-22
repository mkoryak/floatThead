interface floatTheadOptions {
    position?: string;
    scrollContainer?: ($container: JQuery) => void | boolean;
    responsiveContainer?: ($container: JQuery) => void;
    ariaLabel: ($table: JQuery, $headerCell: JQuery, columnIndex: number) => void;
    headerCellSelector?: string;
    floatTableClass?: string;
    floatContainerClass?: string;
    top?: number;
    bottom?: number;
    zIndex?: number;
    debug?: boolean;
    getSizingRow?: () => void;
    copyTableClass?: boolean;
    autoReflow?: boolean;
}

interface JQuery {
    floatThead(floatTheadOptions?: floatTheadOptions): void;
    floatThead(action: string): void;
    trigger(action: string): void;
    on(events: string, handler: (event: Event, $floatContainer: JQuery) => void): void;
    on(events: string, handler: (event: Event, isFloated: boolean, $floatContainer: JQuery) => void): void;
}