import { makeAutoObservable } from 'mobx';
import { createContext, FC, ReactNode, useContext } from 'react';

// Useful links:
// https://blog.logrocket.com/react-hooks-context-redux-state-management/
// https://mobx.js.org/react-integration.html
// https://dev.to/alex1998dmit/how-to-use-mobx-in-nextjs-application-with-demo-4oe5
export class ExampleStore {
    secondsPassed = 0;
    clicked = 0;

    constructor() {
        makeAutoObservable(this);
    }

    increaseTimer() {
        this.secondsPassed += 1;
    }

    increaseClicks() {
        this.clicked += 1;
    }

    resetTimer() {
        this.secondsPassed = 0;
    }
}

// @ts-ignore
const ExampleStoreContext = createContext<ExampleStore>(null);

// Store provider for setup store in context
export const ExampleStoreProvider: FC<{ store?: ExampleStore, children?: ReactNode }> = ({ store, children }) => {
    if (!store) {
        store = new ExampleStore();
    }

    return <ExampleStoreContext.Provider value={store}>{children}</ExampleStoreContext.Provider>
};

// Get store
export const useExampleStore = () => {
    return useContext(ExampleStoreContext);
};
