"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect } from "react";
import { issueSchema, IssueSchema } from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import { createIssue, updateIssue } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const IssueForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueSchema>({
    resolver: zodResolver(issueSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createIssue : updateIssue,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
  console.log("Form submitted with data:", data); // Debugging check
  formAction(data);

  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Issue has been ${type === "create" ? "reported" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { students, lecturers } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Report a new issue" : "Update the issue"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Issue Title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        <InputField
          label="Issue Description"
          name="description"
          defaultValue={data?.description}
          register={register}
          error={errors?.description}
        />
        <InputField
          label="Issue createdAt"
          name="createdAt"
          defaultValue={data?.datetime}
          register={register}
          error={errors?.createdAt}
          type="datetime-local"
        />
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
         />
         )}
        {/* Status Dropdown for Admin */}
        {type === "update" && (
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Issue Status</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("status")}
              defaultValue={data?.status}
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="FIXED">Fixed</option>
              <option value="NOT_FIXED">Not Fixed</option>
            </select>
            {errors.status?.message && (
            <p className="text-xs text-red-400">
              {errors.status.message.toString()}
            </p>
          )}
          </div>
        )}

        {/* Select Reporter (Student or Lecturer) */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Reported By</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("studentId")}
            defaultValue={data?.studentId}
          >
            <option value="">Select Student</option>
            {students.map(
              (student: { id: string; name: string; surname: string }) => (
                <option value={student.id} key={student.id}>
                  {student.name} {student.surname}
                </option>
              )
            )}
            {errors.studentId?.message && (
            <p className="text-xs text-red-400">
              {errors.studentId.message.toString()}
            </p>
          )}
          </select>

          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full mt-2"
            {...register("lecturerId")}
            defaultValue={data?.lecturerId}
          >
            <option value="">Select Lecturer</option>
            {lecturers.map(
              (lecturer: { id: string; name: string; surname: string }) => (
                <option value={lecturer.id} key={lecturer.id}>
                  {lecturer.name} {lecturer.surname}
                </option>
              )
            )}
          </select>
          {errors.lecturerId?.message && (
            <p className="text-xs text-red-400">
              {errors.lecturerId.message.toString()}
            </p>
          )}
        </div>
      </div>

      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Report Issue" : "Update Issue"}
      </button>
    </form>
  );
};

export default IssueForm;