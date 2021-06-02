import { ref } from "@vue/reactivity";

/** color part of gradient */
interface color {
    id: string;
    rgba: string;
    /** percentage */
    percentage: number;
}


function preventDefault(ev: Event) {
    ev.preventDefault();
}

export function useColors(selector: string) {
    const colors = ref<color[]>([
        {
            id: Math.random().toString(36).substring(2),
            rgba: "#ff00aa",
            percentage: 50,
        },
        {
            id: Math.random().toString(36).substring(2),
            rgba: "#aabbcc",
            percentage: 10,
        },
        {
            id: Math.random().toString(36).substring(2),
            rgba: "#ff0000",
            percentage: 30,
        },
    ]);

    /**
     * resize and scale
     */
    document.addEventListener("mousedown", function (ev) {
        if (ev.target === null) {
            return;
        }

        const target: HTMLDivElement = <HTMLDivElement>ev.target;
        const action = target.className.indexOf('slide')

        if (action < 0) {
            return;
        }

        console.log(target)
        ev.preventDefault();
        ev.stopPropagation();

        const id = target.id;

        const colorIdx = colors.value.findIndex((item) => {
            return item.id === id;
        });

        console.log(colorIdx)

        const color = colors.value[colorIdx];

        // save init point
        var _initPoint = {
            left: color.percentage,
        };

        var initX = ev.pageX;

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

                if (percentage < 0) {
                    percentage = 0
                }
                if (percentage > 100) {
                    percentage = 100
                }
                color.percentage = percentage
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