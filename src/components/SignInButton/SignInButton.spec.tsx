import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/client";
import { mocked } from "ts-jest/utils";
import { SignInButton } from ".";

jest.mock("next-auth/client");
const useSessionMocked = mocked(useSession);

describe("SignInButton Component", () => {
  it("should renders correcty when user is not authenticated", () => {

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(
      <SignInButton /> 
    );

    expect(screen.getByText("Sign in with Github")).toBeInTheDocument();
  });
  
  it("should renders correcty when user is authenticated", () => {
    useSessionMocked.mockReturnValueOnce([{
      user: {name: "John Doe", email: "johndoe@test.com", image: "image/path/test" }
    }, false]);

    render(
      <SignInButton /> 
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});