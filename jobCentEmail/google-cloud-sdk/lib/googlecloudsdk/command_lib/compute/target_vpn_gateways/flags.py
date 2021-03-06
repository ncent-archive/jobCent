# -*- coding: utf-8 -*- #
# Copyright 2016 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Flags and helpers for the compute target-vpn-gateways commands."""

from __future__ import absolute_import
from __future__ import unicode_literals
from googlecloudsdk.command_lib.compute import completers as compute_completers
from googlecloudsdk.command_lib.compute import flags as compute_flags

DEFAULT_LIST_FORMAT = """\
    table(
      name,
      network.basename(),
      region.basename()
    )"""


class TargetVpnGatewaysCompleter(compute_completers.ListCommandCompleter):

  def __init__(self, **kwargs):
    super(TargetVpnGatewaysCompleter, self).__init__(
        collection='compute.targetVpnGateways',
        list_command='compute target-vpn-gateways list --uri',
        **kwargs)


def TargetVpnGatewayArgument(required=True, plural=False):
  return compute_flags.ResourceArgument(
      resource_name='Target VPN Gateway',
      completer=TargetVpnGatewaysCompleter,
      plural=plural,
      required=required,
      regional_collection='compute.targetVpnGateways',
      region_explanation=compute_flags.REGION_PROPERTY_EXPLANATION)


def TargetVpnGatewayArgumentForVpnTunnel(required=True):
  return compute_flags.ResourceArgument(
      resource_name='Target VPN Gateway',
      name='--target-vpn-gateway',
      completer=TargetVpnGatewaysCompleter,
      plural=False,
      required=required,
      regional_collection='compute.targetVpnGateways',
      short_help='A reference to a target vpn gateway',
      region_explanation=('Should be the same as region, if not specified, '
                          'it will be automatically set.'))
