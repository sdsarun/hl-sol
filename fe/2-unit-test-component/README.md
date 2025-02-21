# Unit Test UserProfile with Jest and React Testing Library

## Tech stack
- NextJS 15
- Jest
- React Testing Library
- Mocking Service Worker

## Testing
### Mock API Setup
```typescript
// mocks/handlers/user.ts
import { User } from '@/components/user-profile';
import { http, HttpResponse } from 'msw'
 
export const handlers = [
  http.get('https://api.example.com/users/:userId', ({ params }) => {
    const { userId } = params;

    const mockUsers: User[] = [
      {
        userId: "U0001",
        name: "Sarun Daunghirun",
        email: "sdsarun@outlook.com"
      },
      {
        userId: "U0002",
        name: null,
        email: null,
      }
    ];

    const targetUser = mockUsers.find((user) => user.userId === userId);
    if (!targetUser) {
      return HttpResponse.json({ error: "User not found" }, { status: 404 });
    }

    return HttpResponse.json(targetUser);
  }),
]
```

### Testing the UserProfile Component

#### Test cases

| **Test Case**                                    | **Expected**                                                       |
|--------------------------------------------------|-----------------------------------------------------------------------|
| **Display Loading State**                        | Ensure the component shows a "Loading..." message while data is being fetched. |
| **Do Not Display User Details During Data Fetch**| Ensure no user details (name/email) are displayed while the data is being fetched. |
| **Do Not Display Error Details During Data Fetch**| Ensure no error message is displayed while the data is fetching.      |
| **Display User Details After Successful Fetch** | Ensure the user's name and email are displayed once the data is fetched successfully. |
| **Display Error Message on Fetch Failure**      | Ensure an error message is displayed if the fetch fails or the user is not found. |


#### Test runner

```typescript
// components/__tests__/user-profile.test.tsx

import UserProfile from "@/components/user-profile";
import { server } from "@/mocks/node";
import { cleanup, render, screen } from "@testing-library/react";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("<UserProfile />", () => {
  afterEach(() => cleanup());

  it("should display loading state while data fetching", () => {
    render(<UserProfile userId="U0001" />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should not display user details while data fetching", async () => {
    render(<UserProfile userId="U0001" />);

    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    expect(screen.queryByText(/email:/i)).not.toBeInTheDocument();
  });

  it("should not display error details while data fetching", async () => {
    render(<UserProfile userId="U0001" />);
    
    expect(screen.queryByText(/error:/i)).not.toBeInTheDocument();
  });

  it("should display user details once fetected success", async () => {
    render(<UserProfile userId="U0001" />);

    expect(await screen.findByRole("heading", { level: 1, name: /Sarun Daunghirun/i })).toBeInTheDocument();
    expect(await screen.findByText(/sdsarun@outlook.com/i)).toBeInTheDocument();
  });

  it("should display error details once fetched failed", async () => {
    render(<UserProfile />);

    expect(await screen.findByText(/Failed to fetch user data/i)).toBeInTheDocument();
  });
});

```