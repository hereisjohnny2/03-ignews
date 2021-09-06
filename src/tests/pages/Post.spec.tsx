import { render, screen } from "@testing-library/react";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { mocked } from "ts-jest/utils";
import { getPrismicClient } from "../../services/prismic";
import { getSession } from "next-auth/client";

const post = {
  slug: "test-slug",
  title: "test-title",
  content: "test-content",
  updatedAt: "02 de fevereiro de 2021",
};

jest.mock("next-auth/client")
jest.mock("../../services/prismic");

describe("Post Page", () => {
  it("should renders correctly", () => {
    render(
      <Post
        key={post.slug} 
        post={post}
      />
    );

    expect(screen.getByText(post.title)).toBeInTheDocument();    
    expect(screen.getByText(post.content)).toBeInTheDocument();    
    expect(screen.getByText(post.updatedAt)).toBeInTheDocument();    
  });

  it("should redirect if no user subscription is found", async () => {
    const getSessionMocked = mocked(getSession);
    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null
    });

    const response = await getServerSideProps({
      params: { slug: post.slug }
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: {
          destination: "/",
          permanent: false,
        }
      })
    );
  });

  it("loads initial data", async () => {
    const getSessionMocked = mocked(getSession);
    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "fake-active-subscription"
    });

    const getPrismicClientMocked = mocked(getPrismicClient);
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: "heading", text: post.title}
          ],
          content: [
            { type: "paragraph", text: post.content}
          ]
        },
        last_publication_date:  "02-02-2021",
      })
    } as any);

    const response = await getServerSideProps({
      params: { slug: post.slug }
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            title: post.title,
            content: `<p>${post.content}</p>`,
            updatedAt: post.updatedAt,
            slug: post.slug,
          }
        }
      })
    );    
  });
});