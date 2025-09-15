declare module 'asciichart' {
  interface PlotOptions {
    height?: number;
    colors?: any[];
    padding?: string;
    format?: (value: number, index: number) => string;
  }

  function plot(data: number[], options?: PlotOptions): string;

  const blue: any;
  const green: any;
  const red: any;
  const yellow: any;
  const cyan: any;
  const magenta: any;

  export { plot, blue, green, red, yellow, cyan, magenta };
  export default { plot, blue, green, red, yellow, cyan, magenta };
}