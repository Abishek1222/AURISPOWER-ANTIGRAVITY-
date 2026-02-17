from simulator.engine import ElectricalDataSimulator
from simulator.fault_injector import FaultInjector

class ZoneSimulator:
    def __init__(self, zone_id, zone_name):
        self.zone_id = zone_id
        self.zone_name = zone_name
        self.simulator = ElectricalDataSimulator()
        self.fault_injector = FaultInjector()
    
    def get_reading(self):
        data = self.simulator.generate_reading()
        data = self.fault_injector.apply_fault(data)
        data['zone_id'] = self.zone_id
        data['zone_name'] = self.zone_name
        return data

class MultiZoneEngine:
    def __init__(self):
        self.zones = [
            ZoneSimulator("zone_1", "Manufacturing Unit"),
            ZoneSimulator("zone_2", "Server Room"),
            ZoneSimulator("zone_3", "HVAC Assembly")
        ]

    def get_all_readings(self):
        return [zone.get_reading() for zone in self.zones]

    def get_zone(self, zone_id):
        for zone in self.zones:
            if zone.zone_id == zone_id:
                return zone
        return None
