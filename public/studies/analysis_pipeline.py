"""A reproducible, standard-library data-quality demo using synthetic records.
Run: python3 analysis_pipeline.py
No external data, network, credentials, or client results.
"""
import csv
import io
import json
from collections import defaultdict
from datetime import date
from decimal import Decimal, InvalidOperation

SYNTHETIC_CSV = '''record_id,date,channel,amount
D001,2026-01-01,Email,1200.00
D002,2026-01-02,Social,800.00
D003,2026-01-03,Email,650.00
D002,2026-01-02,Social,800.00
D004,not-a-date,Referral,420.00
D005,2026-01-05,Referral,950.00
D006,2026-01-06,Social,invalid
'''


def analyse(source):
    seen, accepted, rejected = set(), [], []
    totals = defaultdict(Decimal)
    for number, row in enumerate(csv.DictReader(io.StringIO(source)), 2):
        try:
            key = row['record_id'].strip()
            if not key or key in seen:
                raise ValueError('missing or duplicate record ID')
            date.fromisoformat(row['date'])
            amount = Decimal(row['amount'])
            if not amount.is_finite() or amount < 0:
                raise ValueError('amount must be finite and nonnegative')
            channel = row['channel'].strip()
            if not channel:
                raise ValueError('missing channel')
            seen.add(key)
            accepted.append(key)
            totals[channel] += amount
        except (ValueError, InvalidOperation, KeyError) as error:
            rejected.append({'row': number, 'reason': str(error)})
    return {'provenance': 'SYNTHETIC DEMONSTRATION — NOT CLIENT RESULTS',
            'accepted_records': len(accepted), 'rejected_records': rejected,
            'totals_by_channel': {key: str(value) for key, value in sorted(totals.items())},
            'total': str(sum(totals.values(), Decimal('0')))}


if __name__ == '__main__':
    print(json.dumps(analyse(SYNTHETIC_CSV), indent=2))
