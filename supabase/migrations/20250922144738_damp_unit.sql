/*
  # Sample Data for TaskFlow Manager

  This migration adds sample data for demonstration purposes.
  Note: This assumes a user exists - in production, this would be handled by the application.
*/

-- Insert sample tasks (these will only work after a user registers)
-- The user_id will need to be updated to match actual user IDs

-- Sample categories for reference
INSERT INTO tasks (title, description, completed, priority, category, due_date, user_id) VALUES
  ('Complete project proposal', 'Finish the quarterly project proposal for the marketing team', false, 'high', 'Work', CURRENT_DATE + INTERVAL '3 days', auth.uid()),
  ('Buy groceries', 'Get vegetables, fruits, and dairy products for the week', false, 'medium', 'Personal', CURRENT_DATE + INTERVAL '1 day', auth.uid()),
  ('Schedule dentist appointment', 'Annual dental checkup and cleaning', false, 'low', 'Health', CURRENT_DATE + INTERVAL '7 days', auth.uid()),
  ('Review budget', 'Monthly budget review and planning for next month', true, 'medium', 'Finance', CURRENT_DATE - INTERVAL '2 days', auth.uid()),
  ('Team meeting preparation', 'Prepare slides and agenda for weekly team meeting', false, 'high', 'Work', CURRENT_DATE + INTERVAL '2 days', auth.uid())
ON CONFLICT DO NOTHING;

-- Sample transactions
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES
  ('income', 50000.00, 'Salary', 'Monthly salary payment', CURRENT_DATE - INTERVAL '5 days', auth.uid()),
  ('expense', 3500.00, 'Food & Dining', 'Grocery shopping at supermarket', CURRENT_DATE - INTERVAL '3 days', auth.uid()),
  ('expense', 1200.00, 'Transportation', 'Monthly metro card renewal', CURRENT_DATE - INTERVAL '7 days', auth.uid()),
  ('expense', 800.00, 'Entertainment', 'Movie tickets and dinner', CURRENT_DATE - INTERVAL '2 days', auth.uid()),
  ('income', 5000.00, 'Freelance', 'Website design project payment', CURRENT_DATE - INTERVAL '10 days', auth.uid()),
  ('expense', 15000.00, 'Bills & Utilities', 'Monthly rent payment', CURRENT_DATE - INTERVAL '1 day', auth.uid()),
  ('expense', 2500.00, 'Healthcare', 'Medical checkup and medicines', CURRENT_DATE - INTERVAL '4 days', auth.uid()),
  ('expense', 1800.00, 'Shopping', 'Clothing and accessories', CURRENT_DATE - INTERVAL '6 days', auth.uid())
ON CONFLICT DO NOTHING;