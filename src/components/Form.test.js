import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom";
import Form from "./Form";

describe("Form Component", () => {
  test("renders the form and validates fields", async () => {
    render(<Form />);

    // Check if the form fields are rendered
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telephone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Guests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date & Time/i)).toBeInTheDocument();

    // Submit the form without filling any fields
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Reserve/i }));
    });

    // Check for validation error messages
    expect(screen.getByText(/Full name is a required field!/i)).toBeInTheDocument();
    expect(screen.getByText(/Email is a required field!/i)).toBeInTheDocument();
    expect(screen.getByText(/Telephone is a required field!/i)).toBeInTheDocument();
    expect(screen.getByText(/Please specify number of guests per table!/i)).toBeInTheDocument();
    expect(screen.getByText(/Please select date and time!/i)).toBeInTheDocument();

    // Fill in the form with invalid data
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "John" } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "invalid-email" } });
      fireEvent.change(screen.getByLabelText(/Telephone/i), { target: { value: "123" } });
      fireEvent.change(screen.getByLabelText(/Guests/i), { target: { value: "0" } });
      fireEvent.change(screen.getByLabelText(/Date & Time/i), { target: { value: "" } });
      fireEvent.click(screen.getByRole("button", { name: /Reserve/i }));
    });

    // Check for updated validation error messages
    expect(screen.getByText(/Email is not valid!/i)).toBeInTheDocument();
    expect(screen.getByText(/Phone number must be exactly 10 digits!/i)).toBeInTheDocument();
    expect(screen.getByText(/There must be at least 1 guest!/i)).toBeInTheDocument();

    // Fill in the form with valid data
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "John Doe" } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john.doe@example.com" } });
      fireEvent.change(screen.getByLabelText(/Telephone/i), { target: { value: "1234567890" } });
      fireEvent.change(screen.getByLabelText(/Guests/i), { target: { value: "2" } });
      fireEvent.change(screen.getByLabelText(/Date & Time/i), { target: { value: "2025-06-12T18:00" } });
      fireEvent.click(screen.getByRole("button", { name: /Reserve/i }));
    });

    // Check if the thank-you message is displayed
    expect(screen.getByText(/Thank you for your reservation!/i)).toBeInTheDocument();
  });
});