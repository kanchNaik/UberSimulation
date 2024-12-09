class PricePrediction:
    rate_per_mile = 2.5
    rate_per_minute = 0.5
    max_surge_multiplier = 2.5

    @classmethod
    def base_price(cls, distance):
        price = cls.rate_per_mile * distance
        return max(price, 3.0)

    @classmethod
    def supply_surge_factor(cls, demand, supply):
        if supply == 0:  # Prevent division by zero
            return cls.max_surge_multiplier  # Max surge multiplier
        demand_supply_ratio = demand / supply
        return min(demand_supply_ratio, cls.max_surge_multiplier)

    @classmethod
    def hourly_surge_factor(cls, hour=2, day_of_week=5):
        time_factor = 1.0
        if 7 <= hour < 10 or 16 <= hour < 19:  # Rush hours
            time_factor = 1.5
        elif 22 <= hour or hour < 6:  # Late night
            time_factor = 1.2

        if day_of_week >= 5:  # Weekend
            time_factor *= 1.1

        return time_factor

    @classmethod
    def predict_ride_price(cls):
        # TODO Add your prediction logic here, from Jupyter Notebook
        return 0

    @classmethod
    def get_ride_price(cls, demand, supply, passenger_count, distance):
        base_price = cls.base_price(distance)
        surge_price = base_price * cls.supply_surge_factor(demand, supply) * cls.hourly_surge_factor()
        predicted_price = cls.predict_ride_price()
        if predicted_price/surge_price > 1.5:
            return surge_price * 1.5
        else:
            return max(predicted_price, surge_price)

    @classmethod
    def log_ride_price(cls, demand, supply, passenger_count, distance):
        print(f"Base price: ${cls.base_price(distance):.2f}")
        print(f"Supply surge factor: {cls.supply_surge_factor(demand, supply):.2f}")
        print(f"Hourly surge factor: {cls.hourly_surge_factor():.2f}")
        print(f"Predicted price: ${cls.predict_ride_price():.2f}")
        print(f"Ride price: ${cls.get_ride_price(demand, supply, passenger_count, distance):.2f}")