import { render, screen } from "@testing-library/react";
import Post, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { mocked } from "ts-jest/utils";
import { getPrismicClient } from "../../services/prismic";
import { getSession, useSession } from "next-auth/client";
import PostPreview from "../../pages/posts/preview/[slug]";
import { useRouter } from "next/router";

const post = {
  slug: "test-slug",
  title: "test-title",
  content: "test-content",
  updatedAt: "02 de fevereiro de 2021",
};

jest.mock("next-auth/client");
jest.mock("../../services/prismic");
jest.mock("next/router");

describe("Post Page", () => {
  it("should renders correctly", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(
      <PostPreview
        key={post.slug} 
        post={post}
      />
    );

    expect(screen.getByText(post.title)).toBeInTheDocument();    
    expect(screen.getByText(post.content)).toBeInTheDocument();    
    expect(screen.getByText(post.updatedAt)).toBeInTheDocument();    
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();    
  });

  it("should redirect to full post if user subscribed", async () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([{
      activeSubscription: "fake-active-subscription"
    }, false]);

    const pushMock = jest.fn();

    const useRouterMocked = mocked(useRouter);
    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(
      <PostPreview
        key={post.slug} 
        post={post}
      />
    );

    expect(pushMock).toBeCalledWith(`/posts/${post.slug}`);    
  });

  it("loads initial data", async () => {

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

    const response = await getStaticProps({
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