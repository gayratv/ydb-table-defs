const escape = '\x1b[';

export enum ColorConsole {
    Reset = '0m',
    Bold = '01m',

    Clear = '2J',
    Clear_eol = 'K',
    Invisible = '8m',

    Bright = '1m',
    Dim = '2m',
    Underscore = '4m',
    Blink = '5m',
    Reverse = '7m',
    Hidden = '8m',

    FgBlack = '30m',
    FgRed = '31m',
    FgGreen = '32m',
    FgYellow = '33m',
    FgBlue = '34m',
    FgMagenta = '35m',
    FgCyan = '36m',
    FgWhite = '37m',

    FgBlackBold = '1;30m',
    FgRedBold = '1;31m', //
    FgGreenBold = '1;32m',
    FgYellowBold = '1;33m',
    FgBlueBold = '1;34m',
    FgMagentaBold = '1;35m',
    FgCyanBold = '1;36m',
    FgWhiteBold = '1;37m',

    BgBlack = '40m',
    BgRed = '41m',
    BgGreen = '42m',
    BgYellow = '43m',
    BgBlue = '44m',
    BgMagenta = '45m',
    BgCyan = '46m',
    BgWhite = '47m',
}

// console.log('36m%s0m', 'I am cyan');  //cyan
// console.log('33m%s0m', stringToMakeYellow);  //yellow

export class CT {
    static reset() {
        return `${escape}${ColorConsole.Reset}`;
    }

    static set_fg_colorRGB(r: number, g: number, b: number) {
        return `${escape}38;2;${r};${g};${b}m`;
    }
    static set_bg_colorRGB(r: number, g: number, b: number) {
        return `${escape}48;2;${r};${g};${b}m`;
    }

    static default_foreground() {
        return `${escape}39m`;
    }

    static default_background() {
        return `${escape}49m`;
    }

    static default() {
        return `${escape}49m${escape}39m`;
    }

    static set_color(color: ColorConsole) {
        return `${escape}${color}`;
    }

    static print_fgColor(color: ColorConsole, ...args: any[]) {
        console.log(CT.set_color(color), ...args, CT.reset());
    }
}

// console.log(CT.set_bg_colorRGB(15, 160, 5), 'asdlkj ');
