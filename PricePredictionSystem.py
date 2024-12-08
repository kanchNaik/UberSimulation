class PricePrediction:
    rate_per_mile = 2.5
    rate_per_minute = 0.5
    max_surge_multiplier = 2.5

    def __init__(self, demand, supply, passenger_count, time, distance):
        self.demand = demand
        self.supply = supply
        self.passenger_count = passenger_count
        self.time = time
        self.distance = distance

    def base_price(self):
        price = self.rate_per_mile * self.distance
        return max(price, 3.0)

    def supply_surge_factor(self):
        if self.supply == 0:  # Prevent division by zero
            return self.max_surge_multiplier  # Max surge multiplier
        demand_supply_ratio = self.demand / self.supply
        return min(demand_supply_ratio, self.max_surge_multiplier)

    def hourly_surge_factor(self):
        hour = self.time.hour
        day_of_week = self.time.weekday()

        time_factor = 1.0
        if 7 <= hour < 10 or 16 <= hour < 19:  # Rush hours
            time_factor = 1.5
        elif 22 <= hour or hour < 6:  # Late night
            time_factor = 1.2

        if day_of_week >= 5:  # Weekend
            time_factor *= 1.1

        return time_factor

    def predict_ride_price(self):
        # TODO Add your prediction logic here, from Jupyter Notebook
        return 0

    def get_ride_price(self):
        base_price = self.base_price()
        surge_price = base_price * self.supply_surge_factor() * self.hourly_surge_factor()
        predicted_price = self.predict_ride_price()
        if predicted_price/surge_price > 1.5:
            return surge_price*1.5
        else:
            return max(predicted_price, surge_price)

    def log_ride_price(self):
        print(f"Base price: ${self.base_price():.2f}")
        print(f"Supply surge factor: {self.supply_surge_factor():.2f}")
        print(f"Hourly surge factor: {self.hourly_surge_factor():.2f}")
        print(f"Predicted price: ${self.predict_ride_price():.2f}")
        print(f"Ride price: ${self.get_ride_price():.2f}")


