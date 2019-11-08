# packer-drachtio-freeswitch-dialogflow

A [packer](https://www.packer.io/) template to build an AMI that implements a [dialogflow](http://dialogflow.com/) telephony gateway.

## Installing 

```
$ git clone git@github.com:davehorton/packer-drachtio-freeswitch-dialogflow.git
$ cd packer-drachtio-freeswitch-dialogflow
$  packer build  \
-var 'aws_access_key=YOUR-ACCESS-KEY'  \
-var 'aws_secret_key=YOUR-SECRET-KEY' \
template.json
```

### variables
These variables can be specified on the `packer build` command line.  Defaults are listed below, where provided.
```
"aws_access_key": ""
```
Your aws access key.
```
"aws_secret_key": ""
```
Your aws secret key.

```
"region": "us-east-1"
```
The region to create the AMI in

```
"ami_description": "dialogflow telephony gateway using drachtio and freeswitch"
```
AMI description.

```
"instance_type": "t2.medium"
```
EC2 Instance type to use when building the AMI.

## Run-time configuration

When you create an instance using the generated AMI, you need to do some final configuration on the instance once it comes up.  Specifically, you need to point to the dialogflow agent that you want execute, and you need to provide authentication credentials by installing a GCP service account key file.

To configure the dialogflow agent, edit `/home/admin/drachtio-dialogflow-phone-gateway/config/local.json`, substituting your dialogflow agent id here:
```
  "dialogflow": {
    "project": "<dialogflow-project-id-goes-here>",
```
Next, upload your service account key file to the server and edit `/etc/systemd/system/freeswitch.service`, substituting the path to the file here:
```
Environment="GOOGLE_APPLICATION_CREDENTIALS=<path-to-your-json-key-file-here>"
```
After editing that file, execute the following commands:
```
sudo systemctl daemon-reload
sudo systemctl restart freeswitch
pm2 restart 0
```
or, alternatively, simply reboot the instance.  When it comes up it will be ready to take calls.

### Firewall / Security Group
Your AWS security group should allow the following traffic into the instance:
- 5060/udp - (SIP) should be allowed in from your sip trunking provider(s) (it's not a great idea to allow sip traffic in from the world)
- 16384 - 32768/udp (RTP) should be allowed in from anywhere

## Troubleshooting
The [Node.js application](https://github.com/davehorton/drachtio-dialogflow-phone-gateway) runs under the [pm2](https://pm2.keymetrics.io/) process manager, so application logs are available via 
```
pm2 log
```
Freeswitch logs can be found as per usual in `/usr/local/freeswitch/logs/freeswitch.log`
