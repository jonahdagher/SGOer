import { useEffect, useMemo } from "react";
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

export default function HomePage({ loadSgos, logout, sgos, msg, sgoMapper }) {
  // Convert your API data into FullCalendar event objects

  useEffect(()=>{loadSgos();}, [])

  const events = useMemo(() => sgoMapper(sgos), [sgos]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Top bar */}
      <AppBar position="sticky" elevation={2} color="transparent">
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            SGOs Calendar
          </Typography>

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
            dateClick={(info) => {
            window.location.href = `/day/${info.dateStr}`;
          }}
          />
        </Paper>
      </Container>
    </Box>
  );
}