class MockStore:
    def __init__(self):
        self.users = []
        self.habits = []
        self.habit_logs = []
        self._user_id_counter = 1
        self._habit_id_counter = 1
        self._log_id_counter = 1

    def add_user(self, user_data):
        user_data['id'] = self._user_id_counter
        self._user_id_counter += 1
        self.users.append(user_data)
        return user_data

    def get_user_by_username(self, username):
        return next((u for u in self.users if u['username'] == username), None)

    def get_user_by_id(self, user_id):
        return next((u for u in self.users if u['id'] == int(user_id)), None)

    def add_habit(self, habit_data):
        habit_data['id'] = self._habit_id_counter
        self._habit_id_counter += 1
        self.habits.append(habit_data)
        return habit_data

    def get_habits_by_user(self, user_id):
        return [h for h in self.habits if h['user_id'] == int(user_id)]

    def get_habit(self, habit_id):
        return next((h for h in self.habits if h['id'] == int(habit_id)), None)

    def delete_habit(self, habit_id):
        self.habits = [h for h in self.habits if h['id'] != int(habit_id)]
        # Cascade delete logs
        self.habit_logs = [l for l in self.habit_logs if l['habit_id'] != int(habit_id)]

    def add_log(self, log_data):
        log_data['id'] = self._log_id_counter
        self._log_id_counter += 1
        self.habit_logs.append(log_data)
        return log_data
    
    def get_logs_by_habit(self, habit_id):
        return [l for l in self.habit_logs if l['habit_id'] == int(habit_id)]
    
    def get_completed_count(self, habit_id):
        return len([l for l in self.habit_logs if l['habit_id'] == int(habit_id) and l['status']])

# Global instance
store = MockStore()
