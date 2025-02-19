"use client";

import React, { useCallback, useState } from "react";

// need use React.memo because react will always re-render children resursivly even props are same.
const SearchBox = React.memo(
  ({
    componentName,
    value,
    onChange,
    placeholder
  }: {
    componentName?: string;
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
  }) => {
    console.log(`${componentName}: render`);

    // recreate everytime when this component re-render
    const handleChage = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (typeof onChange === "function") {
        onChange(event.target.value);
      }
    };

    return (
      <input
        className="px-2 py-1 bg-slate-200 rounded-lg border-[1px] border-black"
        type="text"
        onChange={handleChage}
        placeholder={placeholder}
        value={value}
      />
    );
  }
);

export default function Home() {
  const [searchValue, setSearchValue] = useState<string>("hlab");
  const [searchValue2, setSearchValue2] = useState<string>("");
  const [fetchSearchValueResult, setFetchSearchValueResult] = useState<string>("");
  const [fetchSearchValueResultWithDep, setFetchSearchValueResultWithDep] = useState<string>("");

  // re-create this function everytime when <Home /> re-render
  const handleChange = (value: string) => {
    setSearchValue(value);
  };

  // create once when <Home /> re-render this will same reference that previous created
  // because dependencies in this case is empty = create once
  const handleChangeCallback = useCallback((value: string) => {
    setSearchValue2(value);
  }, []);

  // create once when <Home /> re-render this will same reference that previous created
  // because dependencies in this case is empty = create once
  const fetchFromSearchValueNoDep = useCallback(async () => {
    const fakeFetch = await new Promise<string>((resolve) => setTimeout(() => resolve(searchValue)));
    setFetchSearchValueResult(fakeFetch);
  }, []);

  // recreate everytime when searchValue changed
  // because dependencies in this case is empty = create once
  const fetchFromSearchValueWithDep = useCallback(async () => {
    const fakeFetch = await new Promise<string>((resolve) => setTimeout(() => resolve(searchValue)));
    setFetchSearchValueResultWithDep(fakeFetch);
  }, [searchValue]);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-2xl">Open inspect with F12 to see logging of components</h3>
      <hr />
      <p>
        (1) - Typing below input <strong>with useCallback</strong> to see log what is component re-render.
      </p>
      <p>
        (2) - Typing below input <strong>without useCallback</strong> to see log what is component re-render.
      </p>
      <p>
        (3) - Typing in <strong>without useCallback</strong> then hit both button to see what you got and typing again and hit this again
        to see what you got again.
      </p>

      <h1 className="text-4xl font-bold">Without useCallback</h1>

      <SearchBox
        componentName="1 - SearchBoxWithoutUseCallback"
        value={searchValue}
        onChange={(value) => setSearchValue(value)}
        placeholder="Type this to see below component with useCallback re-render..."
      />

      <SearchBox
        componentName="1.1 - SearchBoxWithoutUseCallback"
        value={searchValue}
        onChange={handleChange}
        placeholder="Type this to see below component with useCallback re-render..."
      />

      <hr />
      <div>
        <button
          className="px-2 py-4 bg-blue-600 rounded-lg text-white"
          onClick={fetchFromSearchValueNoDep}
        >
          fetch from searchValue no deps
        </button>
        <div className="flex items-center gap-2">
          <p className="font-medium">Result fetch from searchValue (no deps): </p>
          <p className="font-bold">{fetchSearchValueResult ?? "Nothing...."}</p>
        </div>
      </div>
      <div>
        <button
          className="px-2 py-4 bg-green-600 rounded-lg text-white"
          onClick={fetchFromSearchValueWithDep}
        >
          fetch from searchValue with deps
        </button>
        <div className="flex items-center gap-2">
          <p className="font-medium">Result fetch from searchValue (with deps): </p>
          <p className="font-bold">{fetchSearchValueResultWithDep ?? "Nothing...."}</p>
        </div>
      </div>

      <p className="text-red-500 italic">
        Expected: you should not see log from '2 - SearchBoxWithUseCallback'
      </p>

      <hr />

      <h1 className="text-4xl font-bold">With useCallback</h1>
      <SearchBox
        componentName="2 - SearchBoxWithUseCallback"
        value={searchValue2}
        onChange={handleChangeCallback}
        placeholder="Type this to see above component without useCallback re-render..."
      />
    </div>
  );
}
