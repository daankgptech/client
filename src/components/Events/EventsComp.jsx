import React, { useState, useEffect } from "react";
import EventCard from "./EventCard";
import {api} from "../../utils/Secure/api";
import { slugify } from "../../utils/slugify";

const EventComp = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");
        // Transform the data to include the slug and id, similar to your old static file
        const dynamicData = response.data.data.map((event, index) => ({
          ...event,
          id: event._id || index, // Use MongoDB _id or index as fallback
          slug: slugify(event.title)
        }));

        setEvents(dynamicData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading events...</div>;
  }

  return (
    <div id="events" className="scroll-mt-[100px] dark:bg-gray-900 dark:text-white py-10">
      <section data-aos="fade-up" className="container">
        <h1 className="my-8 border-l-8 border-rose-300 dark:border-gray-400 text-gray-900 dark:text-gray-400 py-2 pl-2 text-3xl font-bold">
          Our Events
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {events.length > 0 ? (
            events.map((item) => (
              <EventCard key={item.id} {...item} />
            ))
          ) : (
            <p>No events found.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventComp;