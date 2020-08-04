import React from "react";
import { render, waitForElement } from "@testing-library/react";
import axios from "./axios";
import App from "./app";

jest.mock("./axios");

test("app renders nothing until request is complete and then renders a div", () => {
    axios.get.mockResolvedValue({
        data: {
            id: 1,
            first: "Funky",
            last: "Chicken",
            url: "/whatever.jpg",
        },
    });
    const { container } = render(<App />);

    async.expect(container.innerHTML).toBe('');
    await waitForElement(
        () => container.querySelector('div'),
});
