import { render, screen } from "@testing-library/react";
import Posts, { getStaticProps } from "../../pages/posts";
import { mocked } from "ts-jest/utils";
import { getPrismicClient } from "../../services/prismic";

const posts = [
  {
    slug: "test-slug",
    title: "test-title",
    excerpt: "test-content",
    updatedAt: "02 de fevereiro de 2021",
  }
];

jest.mock("../../services/prismic");

describe("Posts Page", () => {
  it("should renders correctly", () => {
    render(
      <Posts 
        posts={posts}
      />
    );

    expect(screen.getByText(posts[0].title)).toBeInTheDocument();    
    expect(screen.getByText(posts[0].excerpt)).toBeInTheDocument();    
    expect(screen.getByText(posts[0].updatedAt)).toBeInTheDocument();    
  });

  it("should load initial data", async () => {
    const getPricmicClientMocked = mocked(getPrismicClient);
    getPricmicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: posts[0].slug,
            data: {
              title: [
                { type: "heading", text: posts[0].title}
              ],
              content: [
                { type: "paragraph", text: posts[0].excerpt}
              ]
            },
            last_publication_date: "02-02-2021"
          }
        ]
      })
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts
        }
      })
    )
  });
});