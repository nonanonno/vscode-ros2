#!/usr/bin/env python3
# Deletes bus errors shown in the following list from stdout/stderr
IGNORES = [
    ('Failed to connect to the bus', 1),
    ('Passthrough is not supported, GL is swiftshader', 1)
]

skip = 0

while(True):
    try:
        line = input()
        if skip > 0:
            skip-=1
            continue
        for ignore in IGNORES:
            if ignore[0] in line:
                skip = ignore[1]
                break
        if skip == 0:
            print(line)
    except EOFError:
        break
