# `useCallback` use for what?

- Use in case memoize `function` only.
- **Important: By default, when a component re-renders, React re-renders all of its children recursively even props is same.**
  - Solve by wrap with `React.memo(<Component />)

## How it work?

- When react re-render your component if you define function without `useCallback` it will **recreated everytime** when this component re-render.
- Let say this component re-render **100 times** then this function will recreated **100 times**.
- Wrap with `useCallback` your function will recreated depend on dependencies changed.

## What does it mean dependencies changed?

```typescript
// full source code see in page.tsx

const UsersManagement = () => {
  const [searchValue, setSearchValue] = useState<string>("hlab");

  // create everytime when <UsersManagement /> component re-render
  const doSomething = () => {
    console.log("hlab");
  };

  // create once only when component is mounted
  const handleChangeCallback = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  // create everytime when searchValue changed.
  // ex. if seatchValue is 'hlab' then change to 'hlabcool' then this function will recreated.
  // otherwise use cache function or in simple word is not recreated again.
  const fetchFromSearchValueWithDep = useCallback(async () => {
    const fakeFetch = await new Promise<string>((resolve) => setTimeout(() => resolve(searchValue)));
    setFetchSearchValueResultWithDep(fakeFetch);
  }, [searchValue]);

  // this function will use searchValue in first render mounted component always
  // ex. if seatchValue is 'hlab' then call this function somewhere then searchValue will 'hlab' forever
  const fetchFromSearchValueNoDep = useCallback(async () => {
    const fakeFetch = await new Promise<string>((resolve) => setTimeout(() => resolve(searchValue)));
    setFetchSearchValueResultWithDep(fakeFetch);
  }, []);

  return (
    <>
      {/* SearchBox must wrap with React.memo. see above why? */}
      <SearchBox 
        value={searchValue} 
        onChange={handleChangeCallback} 
      />

      {/* ...omit components */}
    </>
  );
};
```

## My perspective for `useCallback`

- `useCallback` make the code hard to readable.
- Use when it really need.
- Memory usage: if you function does not recreated i will reconize something in this when using `useCallback` mean they will store in someway in memory right?

## Should you add `useCallback` everywhere?

- If your page is static content the answer is unnecessary.
- If your page like my example or something is re-render often such as typing, drag and drop.
