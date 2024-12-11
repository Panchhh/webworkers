import type { DependencyList } from "react";
import { useEffect, useState } from "react";

export function useAsyncMemo<T>(factory: () => Promise<T> | undefined | null, deps: DependencyList, initial: T | undefined = undefined): T | undefined {
    const [value, setValue] = useState<T | undefined>(initial);

    useEffect(() => {
        let cancel = false;
        const promise = factory();
        if (promise == null) return
        promise
            .then((val) => {
                if (!cancel) {
                    setValue(val);
                }
            })
            .catch(e => {
                console.warn("[useAsyncMemo] promise rejected", e)
            });

        return () => {
            cancel = true;
        }
    }, deps);

    return value;
};