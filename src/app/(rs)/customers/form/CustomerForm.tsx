"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  insertCustomerSchema,
  type insertCustomerType,
  type selectCustomerType,
} from "@/zod-schemas/customer";
import { CustomInput } from "@/components/CustomInput";
import { CustomSelect } from "@/components/CustomSelect";
import { CustomTextArea } from "@/components/CustomTextArea";
import { StatesArray } from "@/lib/constants";
import { CustomCheckbox } from "@/components/CustomCheckbox";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

type CustomerFormProps = {
  customer?: selectCustomerType;
};

export default function CustomerForm({ customer }: CustomerFormProps) {
  const { isLoading, getPermission } = useKindeBrowserClient();
  const isManager = !isLoading && getPermission('manager')?.isGranted;

  const defaultValues: insertCustomerType = {
    id: customer?.id ?? 0,
    firstName: customer?.firstName ?? "",
    lastName: customer?.lastName ?? "",
    address1: customer?.address1 ?? "",
    address2: customer?.address2 ?? "",
    city: customer?.city ?? "",
    state: customer?.state ?? "",
    zip: customer?.zip ?? "",
    phone: customer?.phone ?? "",
    email: customer?.email ?? "",
    notes: customer?.notes ?? "",
    active: customer?.active ?? true,
  };

  const form = useForm<insertCustomerType>({
    mode: "onBlur",
    resolver: zodResolver(insertCustomerSchema),
    defaultValues,
  });

  async function submitForm(data: insertCustomerType) {
    console.log(data);
  }

  return (
    <div className="flex flex-col gap-1 sm:px-8">
      <div>
        <h2 className="text-2xl font-bold">
          {customer?.id ? "Edit" : "New"} Customer {customer?.id ? `#${customer.id}` : "Form"}
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="flex flex-col md:flex-row gap-4 md:gap-8"
        >
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <CustomInput<insertCustomerType> fieldTitle="First Name" nameInSchema="firstName" />
            <CustomInput<insertCustomerType> fieldTitle="Last Name" nameInSchema="lastName" />
            <CustomInput<insertCustomerType> fieldTitle="Address 1" nameInSchema="address1" />
            <CustomInput<insertCustomerType> fieldTitle="Address 2" nameInSchema="address2" />
            <CustomInput<insertCustomerType> fieldTitle="City" nameInSchema="city" />
            <CustomSelect<insertCustomerType> fieldTitle="State" nameInSchema="state" options={StatesArray} />
          </div>

          <div className="flex flex-col gap-4 w-full max-w-xs">
            <CustomInput<insertCustomerType> fieldTitle="Zip Code" nameInSchema="zip" />
            <CustomInput<insertCustomerType> fieldTitle="Email" nameInSchema="email" />
            <CustomInput<insertCustomerType> fieldTitle="Phone" nameInSchema="phone" />
            <CustomTextArea<insertCustomerType> fieldTitle="Notes" nameInSchema="notes" className="h-40" />
            {isLoading ? <span>Loading...</span> : isManager && customer?.id ? (
              <CustomCheckbox<insertCustomerType> fieldTitle="Active" nameInSchema="active" message="Yes" />
            ) : null}
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
