"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
     announcementSchema,
     AnnouncementSchema,
     eventSchema,
     EventSchema,

 } from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import { createEvent, updateEvent} from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


const EventForm = ({
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
  } = useForm<EventSchema>({ // need it here
    resolver: zodResolver(eventSchema), // rot chema 4:07:49
  });

  const [state, formAction] = useFormState(
    type === "create" ? createEvent : updateEvent,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Event has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { classes } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new booking" : "Update the booking"} {/* change*/}
      </h1>
      
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="event title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        <InputField
          label="event description"
          name="description"
          defaultValue={data?.description}
          register={register}
          error={errors?.description}
        />
        <InputField
          label="event startTime"
          name="startTime"
          defaultValue={data?.datetime}
          register={register}
          error={errors?.startTime}
          type="datetime-local"
        />
        <InputField
          label="event endTime"
          name="endTime"
          defaultValue={data?.datetime}
          register={register}
          error={errors?.endTime}
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
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">event</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classId")}
            defaultValue={data?.classId}
          >
            {classes.map(
             (classItem: { 
                    id: number;
                    name: string;
                    capacity: number;
                    _count: { events: number };
             }) => (
              <option value={classItem.id} key={classItem.id}>
               ({classItem.name} -{" "}
                  {classItem._count.events + "/" + classItem.capacity}{" "}
                  Capacity)
              </option>
            ))}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-400">
              {errors.classId.message.toString()}
            </p>
          )}
        </div>
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default EventForm;
{/**/}