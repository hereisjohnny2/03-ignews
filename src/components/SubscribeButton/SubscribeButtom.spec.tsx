import { render, screen, fireEvent } from "@testing-library/react";
import { signIn, useSession } from "next-auth/client";
import { mocked } from "ts-jest/utils";
import { useRouter } from "next/router";
import { SubscribeButton } from ".";

jest.mock("next-auth/client");
jest.mock("next/router");

const useSessionMocked = mocked(useSession);
const signInMocked = mocked(signIn);
const useRouterMocked = mocked(useRouter);

describe("SubscribeButton Component", () => {
  it("should renders correcty", () => {
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(
      <SubscribeButton /> 
    );

    expect(screen.getByText("Subscribe Now")).toBeInTheDocument();
  });

  it("should redirect user to signIn when not authenticated", () => {
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe Now");

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });

  it("should redirects to posts when user already has a subscription", () => {
    useSessionMocked.mockReturnValueOnce([
      {
        user: {name: "John Doe", email: "johndoe@test.com", image: "image/path/test" },
        activeSubscription: "fake-active-subscription"
      }, 
      false
    ]);
    const pushMock = jest.fn();

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe Now");

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalledWith("/posts");
  });
});