ONLINE EVENT MANAGEMENT SYSTEM USING JAVA

1. Put OnlineEventManagementSystem.java in a folder.
2. Open Command Prompt/Terminal in that folder.
3. Compile:
   javac OnlineEventManagementSystem.java
4. Run:
   java OnlineEventManagementSystem

Expected initial window:
- Title: Online Event Management System
- Two event panels
- Event 101: Java Programming Workshop, Seminar Hall A, CSE Department, 0/50, REGISTRATION OPEN
- Event 102: Web Development Seminar, Seminar Hall B, IT Department, 0/40, REGISTRATION OPEN
- REGISTER EVENT and CANCEL REGISTRATION buttons for each event.

Demo sequence:
A. Click REGISTER EVENT under Java Programming Workshop.
   Result: count becomes 1/50 and message "Event registered successfully!"
B. Click OK.
C. Click CANCEL REGISTRATION.
   Result: count returns to 0/50 and message "Event registration cancelled!"
D. For the full-registration error demo, temporarily change event1 capacity from 50 to 1,
   run the program again, click REGISTER EVENT once (1/1), then click REGISTER EVENT again.
   Result: "Event registration is full!"
E. Restore 50 before the final submission.

This project is a Java Swing desktop application, not a browser webpage. The supplied report describes JFrame/JPanel/JLabel/JButton/JOptionPane and action listeners as the GUI implementation.
