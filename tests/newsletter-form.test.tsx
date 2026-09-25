import React from "react";
import { afterEach, expect, test, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import NewsletterSubscription from "../src/components/NewsletterSubscription";
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
function completeForm() {
  fireEvent.change(screen.getByLabelText("First name"), {
    target: { value: "Test" },
  });
  fireEvent.change(screen.getByLabelText("Last name"), {
    target: { value: "Reader" },
  });
  fireEvent.change(screen.getByLabelText("Email address"), {
    target: { value: "reader@example.com" },
  });
  fireEvent.click(screen.getByRole("checkbox"));
}
test("submits consent and names, shows confirmation and resets the form", async () => {
  const fetcher = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ message: "Thank you!" }),
  });
  vi.stubGlobal("fetch", fetcher);
  render(<NewsletterSubscription />);
  completeForm();
  fireEvent.click(screen.getByRole("button", { name: "Sign up" }));
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent("Thank you!"),
  );
  expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({
    email: "reader@example.com",
    firstName: "Test",
    lastName: "Reader",
    consent: true,
    website: "",
  });
  expect(screen.getByLabelText("Email address")).toHaveValue("");
});
test("preserves input and permits retry when the network fails", async () => {
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
  render(<NewsletterSubscription />);
  completeForm();
  fireEvent.click(screen.getByRole("button", { name: "Sign up" }));
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent(
      "We could not connect",
    ),
  );
  expect(screen.getByLabelText("Email address")).toHaveValue(
    "reader@example.com",
  );
  expect(screen.getByRole("button", { name: "Sign up" })).toBeEnabled();
});
