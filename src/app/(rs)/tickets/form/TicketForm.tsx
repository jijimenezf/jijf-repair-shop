import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  insertTicketSchema,
  type insertTicketType,
  type selectTicketType,
} from "@/zod-schemas/tickets";
import { selectCustomerType } from "@/zod-schemas/customer";
import { CustomInput } from "@/components/CustomInput";
import { CustomSelect } from "@/components/CustomSelect";
import { CustomTextArea } from "@/components/CustomTextArea";
import { CustomCheckbox } from "@/components/CustomCheckbox";

type TicketFormProps = {
  customer: selectCustomerType;
  ticket?: selectTicketType;
};

export default function TicketForm({ customer, ticket }: TicketFormProps) {
  const defaultValues: insertTicketType = {
    id: ticket?.id ?? "(New)",
    customerId: ticket?.customerId ?? customer.id,
    title: ticket?.title ?? "",
    description: ticket?.description ?? "",
    completed: ticket?.completed ?? false,
    tech: ticket?.tech ?? "new-ticket@example.com",
  };

  const form = useForm<insertTicketType>({
    mode: "onBlur",
    resolver: zodResolver(insertTicketSchema),
    defaultValues,
  });

  async function submitForm(data: insertTicketType) {
    console.log(data);
  }

  return (
    <div className="flex flex-col gap-1 sm:px-8">
      <div>
        <h2 className="text-2xl font-bold">
          {ticket?.id ? `Edit Ticket # ${ticket.id}` : "New Ticket Form"}
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="flex flex-col md:flex-row gap-4 md:gap-8"
        >
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <CustomInput<insertTicketType> fieldTitle="Title" nameInSchema="title" />
            <CustomInput<insertTicketType> fieldTitle="Tech" nameInSchema="tech" disabled={true} />
            <CustomCheckbox<insertTicketType> fieldTitle="Completed" nameInSchema="completed" message="Yes" />
            <div className="mt-4 space-y-2">
            <h3 className="text-lg">Customer Info</h3>
              <hr className="w-4/5" />
              <p>{customer.firstName} {customer.lastName}</p>
              <p>{customer.address1}</p>
              {customer.address2 ? <p>{customer.address2}</p> : null}
              <p>{customer.city}, {customer.state} {customer.zip}</p>
              <hr className="w-4/5" />
              <p>{customer.email}</p>
              <p>Phone: {customer.phone}</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <CustomTextArea<insertTicketType> fieldTitle="Description" nameInSchema="description" className="h-96" />
            <div className="flex gap-2">
              <Button
                type="submit"
                className="w-3/4"
                variant="default"
                title="Save"
              >Save</Button>

              <Button
                type="button"
                variant="destructive"
                title="Reset"
                onClick={() => form.reset(defaultValues)}
              >Reset</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
