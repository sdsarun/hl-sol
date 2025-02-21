import UserProfile from "@/components/user-profile";
import { server } from "@/mocks/node";
import { cleanup, render, screen } from "@testing-library/react";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// test suite
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
