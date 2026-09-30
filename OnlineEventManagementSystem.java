import java.awt.*;
import javax.swing.*;

abstract class Event {
    protected int eventId;
    protected String eventName;
    protected String venue;

    Event(int eventId, String eventName, String venue) {
        this.eventId = eventId;
        this.eventName = eventName;
        this.venue = venue;
    }

    abstract void display();
}

interface EventRole {
    void registerEvent(Event e);
    void cancelEvent(Event e);
}

class OnlineEvent extends Event {
    private String organizer;
    private int capacity;
    private int registered = 0;

    OnlineEvent(int eventId, String eventName, String venue,
                String organizer, int capacity) {
        super(eventId, eventName, venue);
        this.organizer = organizer;
        this.capacity = capacity;
    }

    boolean isAvailable() {
        return registered < capacity;
    }

    void register() {
        if (!isAvailable()) {
            throw new IllegalStateException("Event registration is full!");
        }
        registered++;
    }

    void cancel() {
        if (registered > 0) {
            registered--;
        }
    }

    int getRegistered() {
        return registered;
    }

    int getCapacity() {
        return capacity;
    }

    String getOrganizer() {
        return organizer;
    }

    @Override
    void display() {
        System.out.println(
            eventId + " | " + eventName + " | " + venue +
            " | Organizer: " + organizer +
            " | Registered: " + registered + "/" + capacity
        );
    }
}

class Participant implements EventRole {
    protected int participantId;
    protected String name;

    Participant(int participantId, String name) {
        this.participantId = participantId;
        this.name = name;
    }

    @Override
    public void registerEvent(Event e) {
        OnlineEvent event = (OnlineEvent) e;
        event.register();
    }

    @Override
    public void cancelEvent(Event e) {
        OnlineEvent event = (OnlineEvent) e;
        event.cancel();
    }
}

public class OnlineEventManagementSystem {
    public static void main(String[] args) {
        OnlineEvent event1 = new OnlineEvent(
            101,
            "Java Programming Workshop",
            "Seminar Hall A",
            "CSE Department",
            50
        );

        OnlineEvent event2 = new OnlineEvent(
            102,
            "Web Development Seminar",
            "Seminar Hall B",
            "IT Department",
            40
        );

        Participant participant = new Participant(1, "J. Sri Harsha");

        JFrame frame = new JFrame("Online Event Management System");
        frame.setSize(800, 600);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLocationRelativeTo(null);

        JPanel mainPanel = new JPanel();
        mainPanel.setLayout(new BorderLayout(15, 15));
        mainPanel.setBorder(
            BorderFactory.createEmptyBorder(20, 20, 20, 20)
        );

        JPanel eventsPanel = new JPanel();
        eventsPanel.setLayout(new GridLayout(1, 2, 15, 15));
        eventsPanel.add(createEventPanel(event1, participant));
        eventsPanel.add(createEventPanel(event2, participant));

        mainPanel.add(eventsPanel, BorderLayout.CENTER);
        frame.add(mainPanel);
        frame.setVisible(true);
    }

    static JPanel createEventPanel(
        OnlineEvent event,
        Participant participant
    ) {
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        JLabel details = new JLabel();
        JButton registerButton = new JButton("REGISTER EVENT");
        JButton cancelButton = new JButton("CANCEL REGISTRATION");
        JPanel buttonPanel = new JPanel();

        buttonPanel.add(registerButton);
        buttonPanel.add(cancelButton);
        updateDetails(details, event);

        registerButton.addActionListener(e -> {
            try {
                participant.registerEvent(event);
                updateDetails(details, event);
                JOptionPane.showMessageDialog(
                    null,
                    "Event registered successfully!"
                );
            } catch (IllegalStateException ex) {
                JOptionPane.showMessageDialog(
                    null,
                    ex.getMessage()
                );
            }
        });

        cancelButton.addActionListener(e -> {
            participant.cancelEvent(event);
            updateDetails(details, event);
            JOptionPane.showMessageDialog(
                null,
                "Event registration cancelled!"
            );
        });

        panel.add(details, BorderLayout.CENTER);
        panel.add(buttonPanel, BorderLayout.SOUTH);
        return panel;
    }

    static void updateDetails(
        JLabel label,
        OnlineEvent event
    ) {
        String status;
        if (event.isAvailable()) {
            status = "REGISTRATION OPEN";
        } else {
            status = "REGISTRATION FULL";
        }

        label.setText(
            "<html>" +
            "<b>Event ID:</b> " + event.eventId + "<br>" +
            "<b>Event Name:</b> " + event.eventName + "<br>" +
            "<b>Venue:</b> " + event.venue + "<br>" +
            "<b>Organizer:</b> " + event.getOrganizer() + "<br>" +
            "<b>Registered:</b> " + event.getRegistered() +
            " / " + event.getCapacity() + "<br>" +
            "<b>Status:</b> " + status +
            "</html>"
        );
    }
}
