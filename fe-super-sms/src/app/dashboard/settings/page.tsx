'use client';

import React from 'react';
import { Card, Button, Input } from '@/components/ui';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">Configure your platform preferences.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-text-primary mb-4 border-b border-border pb-3">General Settings</h3>
            <div className="space-y-4 max-w-md">
              <Input label="Platform Name" defaultValue="SuperSMP" />
              <Input label="Support Email" defaultValue="support@supersmp.com" />
              <Button>Save Changes</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
