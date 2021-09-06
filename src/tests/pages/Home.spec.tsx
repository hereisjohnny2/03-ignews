import { render, screen } from "@testing-library/react";
import Home, { getStaticProps } from "../../pages";
import { stripe } from "../../services/stripe";
import { mocked } from "ts-jest/utils";

jest.mock("next/router");
jest.mock("next-auth/client", () => {
  return {
    useSession: () => [null, false]
  }
});
jest.mock("../../services/stripe");

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

  it("should load initial data", async () => {
    const retriveStripePricesMocked = mocked(stripe.prices.retrieve);
    retriveStripePricesMocked.mockResolvedValueOnce({
      id: "fake-price-id",
      unit_amount: 1000
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: "fake-price-id",
            amount: "$10.00"
          }
        }
      })
    )
  });
});