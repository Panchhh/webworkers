import { DependencyList, useRef, useState } from "react";
import { useAsyncMemo } from "./useAsyncMemo";


export function useAsyncMemoWithLoading<T>(factory: () => Promise<T> | undefined, deps: DependencyList, initial: T | undefined = undefined)
    : { data: T | undefined; isLoading: boolean } {

    const [isLoading, setIsLoading] = useState(false);
    const latestRequestId = useRef(0);

    const data = useAsyncMemo(async () => {
        const requestId = ++latestRequestId.current;
        setIsLoading(true);

        const result = await factory();

        if (requestId === latestRequestId.current) {
            setIsLoading(false);
        }

        return result;
    }, deps, initial);

    return { data, isLoading };
}
