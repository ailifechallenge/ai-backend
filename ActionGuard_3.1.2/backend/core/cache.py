import time
from collections import OrderedDict


class Cache:
    def __init__(self, ttl=120, limit=128):
        self.ttl, self.limit, self.items = ttl, limit, OrderedDict()

    def get(self, key):
        item = self.items.get(key)
        if item and item[0] > time.monotonic():
            return item[1]
        self.items.pop(key, None)

    def put(self, key, value):
        self.items[key] = (time.monotonic() + self.ttl, value)
        self.items.move_to_end(key)
        while len(self.items) > self.limit:
            self.items.popitem(last=False)
        return value
