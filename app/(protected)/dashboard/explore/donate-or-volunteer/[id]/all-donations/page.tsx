'use client'
import { useEffect, useState, use } from 'react';
import Tabs from '../../../../_components/Tabs'
import Table from '../../../../_components/Table'
import { getSingleCampaign } from '../../../../../../../utils/api/campaigns/getCampaigns'

export default function AllDonations(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [campaign, setCampaign] = useState<any>()

  const fetchSingleCampaign = async () => {
    const singleCampaign = await getSingleCampaign(params.id)
    setCampaign(singleCampaign)
  }

  useEffect(() => {
    fetchSingleCampaign()
  }, [])

  const headerTitle = campaign?.campaignType === 'fundraiseAndVolunteer'
  ? 'Donors and Volunteers'
  : campaign?.campaignType === 'fundraise'
  ? 'Donors'
  : 'volunteers'

  return (
    <div>
      {/* page title x subtitle */}
      <hgroup className='mb-[5px]'>
        <h1 className='text-lg md:text-2xl font-semibold text-[#101828] mb-[5px]'>
          All{' '}
          {headerTitle} for {campaign?.title}
        </h1>
        <p className='text-[15px] text-[#667085]'>View all {headerTitle}</p>
      </hgroup>

      {/* donations x volunteering */}
      {campaign?.campaignType === 'fundraiseAndVolunteer' ? (
        <Tabs activeTab={"Donors"}>
          <Tabs.Item heading='Donors'>
            <Table className='hidden md:block mb-9'>
              <Table.Head>
                <Table.HeadCell>Full Name</Table.HeadCell>
                <Table.HeadCell>Amount</Table.HeadCell>
                <Table.HeadCell>Currency</Table.HeadCell>
              </Table.Head>

              <Table.Body>
                {campaign?.campaignDonors?.map(
                  (
                    donors: {
                      fullName: string
                      amount: string
                      currency: string
                    },
                    index: number
                  ) => (
                    <Table.Row key={index}>
                      <Table.Cell>{donors.fullName}</Table.Cell>
                      <Table.Cell>{donors.amount}</Table.Cell>
                      <Table.Cell>{donors.currency}</Table.Cell>
                    </Table.Row>
                  )
                )}
              </Table.Body>
            </Table>
          </Tabs.Item>

          <Tabs.Item heading='Volunteers'>
            <Table className='hidden md:block mb-9'>
              <Table.Head>
                <Table.HeadCell>Full Name</Table.HeadCell>
                <Table.HeadCell>Gender</Table.HeadCell>
                <Table.HeadCell>Age</Table.HeadCell>
              </Table.Head>

              <Table.Body>
                {campaign?.campaignVolunteers?.map(
                  (
                    volunteer: {
                      fullName: string
                      gender: string
                      ageRange: string
                    },
                    index: number
                  ) => (
                    <Table.Row key={index}>
                      <Table.Cell>{volunteer.fullName}</Table.Cell>
                      <Table.Cell>{volunteer.gender}</Table.Cell>
                      <Table.Cell>{volunteer.ageRange}</Table.Cell>
                    </Table.Row>
                  )
                )}
              </Table.Body>
            </Table>
          </Tabs.Item>
        </Tabs>
      ) : campaign?.campaignType === 'fundraise' ? (
        <Tabs>
          <Tabs.Item heading='Donors'>
            <Table className='hidden md:block mb-9'>
              <Table.Head>
                <Table.HeadCell>Full Name</Table.HeadCell>
                <Table.HeadCell>Amount</Table.HeadCell>
                <Table.HeadCell>Currency</Table.HeadCell>
              </Table.Head>

              <Table.Body>
                {campaign?.campaignDonors?.map(
                  (
                    donors: {
                      fullName: string
                      amount: string
                      currency: string
                    },
                    index: number
                  ) => (
                    <Table.Row key={index}>
                      <Table.Cell>{donors.fullName}</Table.Cell>
                      <Table.Cell>{donors.amount}</Table.Cell>
                      <Table.Cell>{donors.currency}</Table.Cell>
                    </Table.Row>
                  )
                )}
              </Table.Body>
            </Table>
          </Tabs.Item>
        </Tabs>
      ) : (
        <Tabs>
          <Tabs.Item heading='Volunteers'>
            <Table className='hidden md:block mb-9'>
              <Table.Head>
                <Table.HeadCell>Full Name</Table.HeadCell>
                <Table.HeadCell>Gender</Table.HeadCell>
                <Table.HeadCell>Age</Table.HeadCell>
              </Table.Head>

              <Table.Body>
                {campaign?.campaignVolunteers?.map(
                  (
                    volunteer: {
                      fullName: string
                      gender: string
                      ageRange: string
                    },
                    index: number
                  ) => (
                    <Table.Row key={index}>
                      <Table.Cell>{volunteer.fullName}</Table.Cell>
                      <Table.Cell>{volunteer.gender}</Table.Cell>
                      <Table.Cell>{volunteer.ageRange}</Table.Cell>
                    </Table.Row>
                  )
                )}
              </Table.Body>
            </Table>
          </Tabs.Item>
        </Tabs>
      )}
    </div>
  )
}
