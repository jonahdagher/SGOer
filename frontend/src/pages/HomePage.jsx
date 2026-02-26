import { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
  Box,
} from "@mui/material";

export default function HomePage({ loadSgos, logout, sgos, msg }) {
  // Convert your API data into FullCalendar event objects
  const events = useMemo(() => {
    if (!Array.isArray(sgos)) return [];

    return sgos.map((sgo) => ({
      id: String(sgo.id),
      title: sgo.description ? sgo.description : `SGO #${sgo.id}`,
      start: sgo.start, // must be ISO string or YYYY-MM-DD
      end: sgo.end || undefined,
      extendedProps: {
        location: sgo.location,
        size: sgo.size,
        bros: sgo.bros || [],
        pnms: sgo.pnms || [],
      },
    }));
  }, [sgos]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Top bar */}
      <AppBar position="sticky" elevation={2} color="transparent">
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            SGOs Calendar
          </Typography>

          <Button
            variant="contained"
            onClick={loadSgos}
            sx={{ textTransform: "none" }}
          >
            Load SGOs
          </Button>

          <Button
            variant="text"
            onClick={logout}
            sx={{ textTransform: "none" }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Wide content area */}
      <Container maxWidth={false} sx={{ py: 3, minHeight: "100vh" }}>
        <Paper
          elevation={2}
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          {/* Status message */}
          {msg ? (
            <Typography variant="body2" sx={{ mb: 1 }}>
              {msg}
            </Typography>
          ) : null}

          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
            expandRows={true}
            dayMaxEventRows={3}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek",
            }}
            events={events}
            eventClick={(info) => {
              const p = info.event.extendedProps;
              alert(
                [
                  `SGO #${info.event.id}`,
                  `Location: ${p.location ?? ""}`,
                  `Size: ${p.size ?? ""}`,
                  `Bros: ${(p.bros ?? []).join(", ")}`,
                  `PNMs: ${(p.pnms ?? []).join(", ")}`,
                ].join("\n")
              );
            }}
          />
        </Paper>
      </Container>
    </Box>
  );
}