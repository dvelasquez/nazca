declare module 'bpmn-auto-layout' {
  /**
   * Generate missing DI (diagram information) for a BPMN process.
   * @param xml BPMN XML string (may lack DI)
   * @returns Promise<string> - BPMN XML string with DI
   */
  export function layoutProcess(xml: string): Promise<string>;
} 