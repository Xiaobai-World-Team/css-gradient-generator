import { ref } from "@vue/reactivity";

/** color part of gradient */
export interface Color {
    id: string;
    r: number;
    g: number;
    b: number;
    a: number;
    /** percentage */
    percentage: number;
    selected: boolean
}

function preventDefault(ev: Event) {
    ev.preventDefault();
}

export function useColors(selector: string) {
    const colors = ref<Color[]>([
        {
            id: Math.random().toString(36).substring(2),
            r: 255,
            g: 100,
            b: 11,
            a: 1,
            percentage: 0,
            selected: false,
        },
        {
            id: Math.random().toString(36).substring(2),
            r: 55,
            g: 255,
            b: 0,
            a: 1,
            percentage: 100,
            selected: false,
        },
    ]);


    /**
     * change slide
     */
    document.addEventListener("mousedown", function (ev) {
        if (ev.target === null) {
            return;
        }

        const target: Element = <Element>ev.target;

        const action = target.className.indexOf('slide')

        if (action < 0) {
            let node = <Element>target;
            while (Array.from(node.classList).indexOf('slide') < 0) {
                node = <Element>node.parentNode
                if (node.nodeName === 'BODY') {
                    colors.value.forEach(c => c.selected = false)
                    break
                }
            }

            return;
        }

        ev.preventDefault();
        ev.stopPropagation();

        const id = target.id;

        const colorIdx = colors.value.findIndex((item) => {
            return item.id === id;
        });

        if (colorIdx < 0) {
            return
        }

        const color = colors.value[colorIdx];

        colors.value.forEach(color => color.selected = false)
        colors.value[colorIdx].selected = true

        // save init point
        var _initPoint = {
            left: color.percentage,
        };

        var initX = ev.pageX;
        var initY = ev.pageY;

        bind();

        function bind() {
            document.addEventListener("selectstart", preventDefault);
            document.addEventListener("dragstart", preventDefault);

            var point = {
                startX: _initPoint.left,
            };

            let controlNode = <HTMLDivElement>document.querySelector(`#${selector} .control`)

            if (!controlNode) {
                return
            }

            function mousemove(ev: MouseEvent) {
                let percentage = point.startX + ((ev.pageX - initX) / controlNode.offsetWidth * 100);
                let y = ev.pageY - initY
                if (y > 60) {
                    colors.value.splice(colorIdx, 1)
                    mouseup()
                    console.log('清空')
                    return
                }

                if (percentage < 0) {
                    percentage = 0
                }
                if (percentage > 100) {
                    percentage = 100
                }
                if (ev.metaKey || ev.shiftKey || ev.ctrlKey || ev.altKey) {
                    color.percentage = parseFloat(percentage.toFixed(2))
                } else {
                    color.percentage = parseFloat(percentage.toFixed(0))
                }
            }
            document.addEventListener("mousemove", mousemove);

            function mouseup() {
                document.removeEventListener("selectstart", preventDefault);
                document.removeEventListener("dragstart", preventDefault);
                document.removeEventListener("mousemove", mousemove);
                document.removeEventListener("mouseup", mouseup);
            }

            document.addEventListener("mouseup", mouseup);
        }


    })
    return colors
}