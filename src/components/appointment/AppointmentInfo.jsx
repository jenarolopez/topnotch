import React from "react";
import {
  AppointmentInfoContainer,
  Info,
  InfoRow,
  UpdateBtn,
} from "./components";

import FormateDateLocal from "../../helpers/FormateDateLocal";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Logic from "./logic";
import { ToastContainer, toast } from "react-toastify";

function AppointmentInfo({ data, setData, setLoading }) {
  const { appointment, live_stream_data, customer, admin} = data;

  const { id } = useParams();

  const { updateAppointment, completeSchedule, deleteAppointment } = Logic({ appointment, id, setData, toast, setLoading, customer, live_stream_data});

  let [formattedDateNTime, setFormattedDateNTime] = useState(null);

  const [toggleChange, setToggleChange] = useState(false);

  useEffect(() => {
    setFormattedDateNTime(FormateDateLocal(`${appointment?.date_n_time}`));
  }, []);

  useEffect(() => {
    setFormattedDateNTime(`${appointment?.date_n_time.replace("T", " ")}`);
  }, [appointment?.date_n_time]);

  return (
    <AppointmentInfoContainer>
      <h2>Appointment Information</h2>
      <ToastContainer autoClose={1500} />
      {appointment?.status === "pending" && (
        <UpdateBtn>
          <i
            className={`editBtn ${toggleChange ? "fa-solid fa-floppy-disk" : "fa-solid fa-pencil"
              }`}
            onClick={() => setToggleChange((prev) => !prev)}
          ></i>
        </UpdateBtn>
      )}

      <InfoRow>
        <Info>
          <h4>Appointment type</h4>
          <span>{appointment?.appointment_type}</span>
        </Info>
      </InfoRow>

      

      <InfoRow>
        <Info>
          <h4>Date n Time </h4>

          {toggleChange ? (
            <input
              type={"datetime-local"}
              value={formattedDateNTime}
              min={`${FormateDateLocal(new Date().toISOString())}`}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  appointment: {
                    ...prev.appointment,
                    date_n_time: e.target.value,
                  },
                }))
              }
            />
          ) : (
            <span>
              {new Date(formattedDateNTime).toDateString()} at{" "}
              {new Date(formattedDateNTime).toLocaleTimeString()} &nbsp;{" "}
            </span>
          )}
        </Info>
      </InfoRow>
      
      <InfoRow>
        <Info>
          <h4>Groomer</h4>
          <span>{admin?.firstname || '--'} {admin?.lastname || '--'}</span>
        </Info>
      </InfoRow>

      <InfoRow>
        <Info>
          <h4>Additional details</h4>
          <label>{appointment?.additional_details}</label>
        </Info>
      </InfoRow>

      <InfoRow>
        <Info status={`${appointment?.status}`}>
          <h4>Status</h4>
          <p>{appointment?.status}</p>
        </Info>
      </InfoRow>

      {
       appointment?.status === "completed" && 
       appointment?.appointment_type === "grooming" && 
       <>
        <InfoRow>
          <Info>
            <h2>Appointment summary</h2>
          </Info>
        </InfoRow>
        <InfoRow>
          <Info>
            <h4>Time of the event</h4>
            <label>
            {live_stream_data?.start_time} - {live_stream_data?.end_time}</label>
          </Info>
        </InfoRow>
        <InfoRow>
          <Info>
            <h4>Record of the stream</h4>
            {
              live_stream_data?.video ? <video src={live_stream_data?.video} controls></video> : <label>Video record stream not available</label>
            }
          </Info>
        </InfoRow>
        </>
      }

      {appointment?.status === "pending" && (
        <InfoRow style={{ justifyContent: "center" }}>
          <button className="reject" onClick={() => updateAppointment('rejected')}>Reject</button>
          <button className="approve" onClick={() => updateAppointment('approved')}>
            Approve
          </button>
        </InfoRow>
      )}

      {
        appointment?.status &&
        appointment?.status !== "pending" &&
        appointment?.status !== "rejected" &&
        appointment?.status !== "completed" &&
        (
          <InfoRow style={{ justifyContent: "center" }}>
            <button className="complete" onClick={completeSchedule}>
              Mark as completed
            </button>
          </InfoRow>
        )}

        {
            appointment?.status === 'completed' &&
            (<InfoRow style={{ justifyContent: "center" }}>
            <button className="reject" onClick={deleteAppointment}>delete</button>
          </InfoRow>)
        }

{
            appointment?.status === 'rejected' &&
            (<InfoRow style={{ justifyContent: "center" }}>
            <button className="reject" onClick={deleteAppointment}>delete</button>
          </InfoRow>)
        }

    </AppointmentInfoContainer>
  );
}

export default AppointmentInfo;
