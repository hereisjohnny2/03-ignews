import { render, screen } from "@testing-library/react";
import Home from "../../pages";

jest.mock("next/router");
jest.mock("next-auth/client", () => {
  return {
    useSession: () => [null, false]
  }
});

describe("Home Page", () => {
  it("should renders correctly", () => {
    render(
      <Home 
        product={{
          amount: "fake-product-amount",
          priceId: "fake-price-id"
        }}
      />
    );

    expect(screen.getByText("for fake-product-amount/month")).toBeInTheDocument();    
  });
})