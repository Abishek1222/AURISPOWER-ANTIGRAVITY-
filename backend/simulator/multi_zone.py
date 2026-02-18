from simulator.engine import DatasetReplayEngine
from simulator.fault_injector import FaultInjector

class ZoneSimulator:
    def __init__(self, zone_id, zone_name, offset=0):
        self.zone_id = zone_id
        self.zone_name = zone_name
        self.simulator = DatasetReplayEngine(offset=offset)
        self.fault_injector = FaultInjector()
    
    def get_reading(self):
        data = self.simulator.generate_reading()
        data = self.fault_injector.apply_fault(data)
        data['zone_id'] = self.zone_id
        data['zone_name'] = self.zone_name
        return data

class MultiZoneEngine:
    def __init__(self):
        # Each zone starts at a different offset so they show different data
        self.zones = [
            ZoneSimulator("zone_1", "Manufacturing Unit", offset=0),
            ZoneSimulator("zone_2", "Server Room", offset=1500),
            ZoneSimulator("zone_3", "HVAC Assembly", offset=3000),
        ]

    def get_all_readings(self):
        return [zone.get_reading() for zone in self.zones]

    def get_zone(self, zone_id):
        for zone in self.zones:
            if zone.zone_id == zone_id:
                return zone
        return None
