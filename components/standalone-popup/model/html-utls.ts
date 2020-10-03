export class HTMLElementUtil {
    // This will support all browser
    public static RemoveElement(el: HTMLElement): void {
        if (el && el.parentNode) {
            el.parentNode.removeChild(el);
        }
    }
}